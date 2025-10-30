import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { HttpService } from '@nestjs/axios';
import {
  acceptedDisclaimerMessageMarkup,
  welcomeMessageMarkup,
} from './markups';
import { MarkupService } from './markup.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import { Model } from 'mongoose';
import { WalletService } from 'src/wallet/wallet.service';
import {
  Outcome,
  Session,
  SessionDocument,
} from 'src/database/schemas/session.schema';

import { Market } from 'src/database/schemas/market.schema';
import { TradeService } from 'src/trade/trade.service';

@Injectable()
export class PulsecastBotService {
  readonly pulseBot: TelegramBot;
  private logger = new Logger(PulsecastBotService.name);
  private token = process.env.TELEGRAM_TOKEN;

  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => MarkupService))
    private readonly markupService: MarkupService,
    private readonly walletService: WalletService,
    @Inject(forwardRef(() => TradeService))
    private readonly tradeService: TradeService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    @InjectModel(Market.name) private readonly marketModel: Model<Market>,
  ) {
    this.pulseBot = new TelegramBot(this.token, { polling: true });
    this.pulseBot.on('message', this.handleRecievedMessages);
    this.pulseBot.on('callback_query', this.handleButtonCommands);
  }

  handleRecievedMessages = async (msg: any) => {
    this.logger.debug(msg);
    try {
      if (!msg.text) {
        return;
      }
      await this.pulseBot.sendChatAction(msg.chat.id, 'typing');
      const [user, session] = await Promise.all([
        this.userModel.findOne({ chatId: msg.chat.id }),
        this.sessionModel.findOne({ chatId: msg.chat.id }),
      ]);

      console.log(msg.text);
      // const username = `${msg.from.username}`;
      const chatId = `${msg.chat.id}`;
      // console.log(chatId);
      // await this.pulseBot.sendMessage(chatId, 'helloe from group');
      // console.log(username, chatId);
      const command = msg.text.trim();

      const regexGroup =
        /^(?:@Pulse_predict_bot|@allbotTestsbot)\s*\/([a-zA-Z0-9_]+)(?:\s+(.*))?$/;
      const matchGroup = msg.text.trim().match(regexGroup);
      const regexAmount = /^\d+(\.\d+)?$/;
      const regexBet = /\/start\s+bet_([a-zA-Z0-9]+)/;
      const matchBet = msg.text.trim().match(regexBet);

      if (msg.chat.type !== 'private' && matchGroup) {
        const command = matchGroup[1];
        return this.handleGroupCommands(command, chatId);
      }
      if (matchBet) {
        await this.pulseBot.deleteMessage(msg.chat.id, msg.message_id);

        // console.log('contract match event:', matchBet[1]);

        if (msg.chat.type !== 'private') {
          return await this.markupService.displayMarketInterface(
            msg.chat.id,
            matchBet[1],
            true,
          );
        } else {
          return await this.markupService.displayMarketInterface(
            msg.chat.id,
            matchBet[1],
          );
        }
      }

      if (
        session &&
        regexAmount.test(msg.text.trim()) &&
        (session.buyPositionAmount || session.sellPositionAmount)
      ) {
        console.log('heree');
        // Handle text inputs if not a command
        return this.handleUserTextInputs(msg, session!);
      }

      if (command === '/start' && msg.chat.type === 'private') {
        const username = `${msg.from.username}`;

        if (!user) {
          await this.saveUser(msg.chat.id, username);
        }

        const welcome = await welcomeMessageMarkup(username);
        const replyMarkup = { inline_keyboard: welcome.keyboard };

        if (welcome) {
          await this.pulseBot.sendChatAction(msg.chat.id, 'typing');

          await this.pulseBot.sendMessage(msg.chat.id, welcome.message, {
            parse_mode: 'HTML',
            reply_markup: replyMarkup,
          });
        } else {
          await this.pulseBot.sendMessage(
            msg.chat.id,
            'There was an error saving your data, Please click the button below to try again.\n\nclick on /start',
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleButtonCommands = async (query: any) => {
    this.logger.debug(query);
    let command: string;
    let action: string;
    let leagueId: string;
    let matchId: string;

    // let parsedData;

    const chatId = query.message.chat.id;
    // const messageId = query.message.message_id;

    function isJSON(str) {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }

    function splitword(word) {
      return word.split('_');
    }

    if (isJSON(query.data)) {
      command = JSON.parse(query.data).command;
      //   userChatId = JSON.parse(query.data).userChatId;
      action = JSON.parse(query.data).action;
      leagueId = JSON.parse(query.data).id;
      matchId = JSON.parse(query.data).mId;
    } else {
      command = query.data;
    }

    try {
      let user: UserDocument;
      let session: SessionDocument;
      if (query.message.chat.type === 'private') {
        user = await this.userModel.findOne({ chatId: chatId });

        if (
          !user ||
          (!user.acceptedDiscalimer && command !== '/acceptDisclaimer')
        ) {
          return await this.pulseBot.sendMessage(
            chatId,
            `Please click /start to setup your account.`,
          );
        }
      }

      switch (command) {
        case '/acceptDisclaimer':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');

          //TODO: MAKE USER ACCEPTDISCLAIMER AS TRUE
          await this.userModel.findOneAndUpdate(
            { chatId: chatId },
            {
              acceptedDiscalimer: true,
            },
            { new: true }, // This ensures the updated document is returned
          );
          const allFeatures = await acceptedDisclaimerMessageMarkup(
            user.svmWalletAddress,
          );
          if (allFeatures) {
            const replyMarkup = { inline_keyboard: allFeatures.keyboard };
            return await this.pulseBot.sendMessage(
              chatId,
              allFeatures.message,
              {
                parse_mode: 'HTML',
                reply_markup: replyMarkup,
              },
            );
          }
          return;

        case '/walletDetails':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          await this.markupService.sendWalletDetails(chatId, user);
          return;

        case '/exportWallet':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          if (!user!.svmWalletAddress) {
            return this.pulseBot.sendMessage(chatId, `You Don't have a wallet`);
          }
          await this.markupService.showExportWalletWarning(chatId);
          return;

        case '/confirmExportWallet':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          session = await this.sessionModel.create({
            chatId: chatId,
            exportWallet: true,
          });
          if (session && user!.svmWalletDetails) {
            let decryptedSVMWallet;
            if (user!.svmWalletDetails) {
              decryptedSVMWallet = await this.walletService.decryptSVMWallet(
                process.env.DEFAULT_WALLET_PIN!,
                user!.svmWalletDetails,
              );
            }

            if (decryptedSVMWallet.privateKey) {
              const latestSession = await this.sessionModel.findOne({
                chatId: chatId,
              });
              const deleteMessagesPromises = [
                ...latestSession!.userInputId.map((id) =>
                  this.pulseBot.deleteMessage(chatId, id),
                ),
              ];

              // Execute all deletions concurrently
              await Promise.all(deleteMessagesPromises);

              // Display the decrypted private key to the user
              await this.markupService.displayWalletPrivateKey(
                chatId,
                decryptedSVMWallet.privateKey || '',
              );

              return;
            }

            // Delete the session after operations
            await this.sessionModel.deleteMany({ chatId: chatId });
          }
          return await this.pulseBot.sendMessage(
            query.message.chat.id,
            `Processing command failed, please try again`,
          );

        case '/resetWallet':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          return this.markupService.showResetWalletWarning(chatId);

        case '/confirmReset':
          // delete any existing session if any
          await this.sessionModel.deleteMany({ chatId: chatId });
          // create a new session
          session = await this.sessionModel.create({
            chatId: chatId,
            resetWallet: true,
          });
          if (session) {
            try {
              await this.pulseBot.sendChatAction(chatId, 'typing');
              if (!user) {
                return await this.pulseBot.sendMessage(
                  chatId,
                  'No detail of this user found',
                );
              }

              const newSVMWallet = this.walletService.createSVMWallet();
              const [encryptedSVMWalletDetails] = await Promise.all([
                this.walletService.encryptSVMWallet(
                  process.env.DEFAULT_WALLET_PIN!,
                  newSVMWallet.privateKey,
                ),
              ]);

              await this.userModel.updateOne(
                { chatId: chatId },
                {
                  $set: {
                    svmWalletAddress: newSVMWallet.address,
                    svmWalletDetails: encryptedSVMWalletDetails.json,
                  },
                },
              );

              await this.pulseBot.sendMessage(
                chatId,
                `Old Wallet deleted successfully, and a new one has be created\n\n<b>wallet :</b> <code>${newSVMWallet.address}</code>`,
                { parse_mode: 'HTML' },
              );
              await this.sessionModel.deleteMany();
              return;
            } catch (error) {
              console.log(error);
            }
          }
          return await this.pulseBot.sendMessage(
            query.message.chat.id,
            `Processing command failed, please try again`,
          );

        case '/leagues':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          await this.markupService.displayLeagues(chatId);
          return;

        case '/nextLeaguePage':
          //   await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          if (action) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [btnPage, identify] = splitword(action);
            const changeDisplay = {
              buttonPage: btnPage,
              messageId: query.message.message_id,
            };
            await this.markupService.displayLeagues(
              query.message.chat.id,
              changeDisplay,
            );
            return;
          }
          return;

        case '/prevLeaguePage':
          //   await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          if (action) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [btnPage, identify] = splitword(action);
            const changeDisplay = {
              buttonPage: btnPage,
              messageId: query.message.message_id,
            };

            await this.markupService.displayLeagues(
              query.message.chat.id,
              changeDisplay,
            );
            return;
          }
          return;

        case '/leagueSelected':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          await this.markupService.promptLeagueActions(chatId, leagueId);
          return;

        case '/live':
        case '/liveMatches':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          if (leagueId) {
            await this.markupService.displayLeagueLiveMatches(chatId, leagueId);
            return;
          } else {
            await this.markupService.displayAllLiveMatches(chatId);
            return;
          }

        case '/fixture':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          if (leagueId) {
            await this.markupService.displayLeagueFixtures(chatId, leagueId);
            return;
          } else {
            await this.markupService.displayAllFixture(chatId);
            return;
          }

        case '/buyHome':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          return await this.markupService.promptBuyAmount(
            query.message.chat.id,
            matchId,
            user,
            Outcome.HOME_WIN,
          );

        case '/buyAway':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          return await this.markupService.promptBuyAmount(
            query.message.chat.id,
            matchId,
            user,
            Outcome.AWAY_WIN,
          );

        case '/buyDraw':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          return await this.markupService.promptBuyAmount(
            query.message.chat.id,
            matchId,
            user,
            Outcome.DRAW,
          );

        case '/Refresh':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          if (leagueId) {
            //TODO:REFRESH LEAGUE LIVE MATCH
            return;
          } else {
            //TODO:REFRESH LEAGUE ALL LIVE MATCH
            return;
          }

        case '/close':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          return await this.pulseBot.deleteMessage(
            query.message.chat.id,
            query.message.message_id,
          );

        case '/closeDelete':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          await this.sessionModel.deleteMany({
            chatId: chatId,
          });
          return await this.pulseBot.deleteMessage(
            query.message.chat.id,
            query.message.message_id,
          );

        default:
          return await this.pulseBot.sendMessage(
            query.message.chat.id,
            `Processing command failed, please try again`,
          );
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handler for users inputs
  handleUserTextInputs = async (
    msg: TelegramBot.Message,
    session?: SessionDocument,
    // user?: UserDocument,
  ) => {
    await this.pulseBot.sendChatAction(msg.chat.id, 'typing');
    try {
      if (session && session.buyPositionAmount) {
        const amount = msg.text.trim();

        // console.log(session);
        const buy = await this.tradeService.buy(
          `${msg.chat.id}`,
          session.matchId,
          session.outcome,
          +amount,
          session.groupId ?? null,
        );
        if (buy) {
          await this.pulseBot.sendMessage(
            msg.chat.id,
            `${buy.message}\n\n${
              buy.tx
                ? `Hash: <a href="${process.env.SOLSCAN_SCAN_URL}tx/${buy.tx}">${buy.tx}</a>`
                : ``
            }`,
            { parse_mode: 'HTML' },
          );
        }
        await this.sessionModel.deleteMany({ chatId: msg.chat.id });
        return;
      } else if (session && session.sellPositionAmount) {
        const amount = msg.text.trim();
        const sell = await this.tradeService.cashout(
          `${msg.chat.id}`,
          session.matchId,
          session.sellPostionId,
          +amount,
          session.groupId ?? null,
        );

        if (sell) {
          return await this.pulseBot.sendMessage(
            msg.chat.id,
            `${sell.message}\n\nHash: <a href="${process.env.SOLSCAN_SCAN_URL}tx/${sell.tx}">${sell.tx}</a>`,
          );
        }
        await this.sessionModel.deleteMany({ chatId: msg.chat.id });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  saveUser = async (chatId: string, username: string) => {
    try {
      const newSVMWallet = this.walletService.createSVMWallet();
      const [encryptedSVMWalletDetails] = await Promise.all([
        this.walletService.encryptSVMWallet(
          process.env.DEFAULT_WALLET_PIN!,
          newSVMWallet.privateKey,
        ),
      ]);

      // Save user details
      const newUser = new this.userModel({
        chatId,
        username,
        svmWalletAddress: newSVMWallet.address,
        svmWalletDetails: encryptedSVMWalletDetails.json,
      });

      return await newUser.save();
    } catch (error) {
      console.log(error);
    }
  };

  handleGroupCommands = async (command, groupId) => {
    this.logger.debug(command);
    // let matchId: string;

    // let parsedData;

    const chatId = groupId;
    // const messageId = query.message.message_id;

    // function isJSON(str) {
    //   try {
    //     JSON.parse(str);
    //     return true;
    //   } catch (e) {
    //     console.log(e);
    //     return false;
    //   }
    // }

    // function splitword(word) {
    //   return word.split('_');
    // }

    // if (isJSON(query.data)) {
    //   command = JSON.parse(query.data).command;
    //   //   userChatId = JSON.parse(query.data).userChatId;
    //   action = JSON.parse(query.data).action;
    //   leagueId = JSON.parse(query.data).id;
    //   matchId = JSON.parse(query.data).mId;
    // } else {
    //   command = query.data;
    // }

    try {
      // const user = await this.userModel.findOne({ chatId: chatId });
      // let session: SessionDocument;
      // if (
      //   !user ||
      //   (!user.acceptedDiscalimer && command !== '/acceptDisclaimer')
      // ) {
      //   return await this.pulseBot.sendMessage(
      //     chatId,
      //     `Please click /start to setup your account.`,
      //   );
      // }
      switch (command) {
        case '/acceptDisclaimer':
          await this.pulseBot.sendChatAction(chatId, 'typing');

        // //TODO: MAKE USER ACCEPTDISCLAIMER AS TRUE
        // await this.userModel.findOneAndUpdate(
        //   { chatId: chatId },
        //   {
        //     acceptedDiscalimer: true,
        //   },
        //   { new: true }, // This ensures the updated document is returned
        // );
        // const allFeatures = await acceptedDisclaimerMessageMarkup(
        //   user.svmWalletAddress,
        // );
        // if (allFeatures) {
        //   const replyMarkup = { inline_keyboard: allFeatures.keyboard };
        //   return await this.pulseBot.sendMessage(
        //     chatId,
        //     allFeatures.message,
        //     {
        //       parse_mode: 'HTML',
        //       reply_markup: replyMarkup,
        //     },
        //   );
        // }
        // return;

        case 'leagues':
          await this.pulseBot.sendChatAction(chatId, 'typing');
          await this.markupService.displayLeagues(chatId);
          return;

        // case '/nextLeaguePage':
        //   //   await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
        //   if (action) {
        //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //     const [btnPage, identify] = splitword(action);
        //     const changeDisplay = {
        //       buttonPage: btnPage,
        //       messageId: query.message.message_id,
        //     };
        //     await this.markupService.displayLeagues(
        //       query.message.chat.id,
        //       changeDisplay,
        //     );
        //     return;
        //   }
        //   return;

        // case '/prevLeaguePage':
        //   //   await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
        //   if (action) {
        //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //     const [btnPage, identify] = splitword(action);
        //     const changeDisplay = {
        //       buttonPage: btnPage,
        //       messageId: query.message.message_id,
        //     };

        //     await this.markupService.displayLeagues(
        //       query.message.chat.id,
        //       changeDisplay,
        //     );
        //     return;
        //   }
        //   return;

        // case '/leagueSelected':
        //   await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
        //   await this.markupService.promptLeagueActions(chatId, leagueId);
        //   return;

        // case '/live':
        // case '/liveMatches':
        //   await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
        //   if (leagueId) {
        //     await this.markupService.displayLeagueLiveMatches(chatId, leagueId);
        //     return;
        //   } else {
        //     await this.markupService.displayAllLiveMatches(chatId);
        //     return;
        //   }

        // case '/fixture':
        //   await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
        //   if (leagueId) {
        //     await this.markupService.displayLeagueFixtures(chatId, leagueId);
        //     return;
        //   } else {
        //     await this.markupService.displayAllFixture(chatId);
        //     return;
        //   }

        // case '/buyHome':
        //   await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
        //   return await this.markupService.promptBuyAmount(
        //     query.message.chat.id,
        //     matchId,
        //     user,
        //     Outcome.HOME_WIN,
        //   );

        // case '/buyAway':
        //   await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
        //   return await this.markupService.promptBuyAmount(
        //     query.message.chat.id,
        //     matchId,
        //     user,
        //     Outcome.AWAY_WIN,
        //   );

        // case '/buyDraw':
        //   await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
        //   return await this.markupService.promptBuyAmount(
        //     query.message.chat.id,
        //     matchId,
        //     user,
        //     Outcome.DRAW,
        //   );

        // case '/Refresh':
        //   await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
        //   if (leagueId) {
        //     //TODO:REFRESH LEAGUE LIVE MATCH
        //     return;
        //   } else {
        //     //TODO:REFRESH LEAGUE ALL LIVE MATCH
        //     return;
        //   }

        // case '/close':
        //   await this.pulseBot.sendChatAction(chatId, 'typing');
        //   return await this.pulseBot.deleteMessage(
        //     chatId,
        //     query.message.message_id,
        //   );

        // case '/closeDelete':
        //   await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
        //   await this.sessionModel.deleteMany({
        //     chatId: chatId,
        //   });
        //   return await this.pulseBot.deleteMessage(
        //     query.message.chat.id,
        //     query.message.message_id,
        //   );

        default:
          return await this.pulseBot.sendMessage(
            chatId,
            `Processing command failed, please try again`,
          );
      }
    } catch (error) {
      console.log(error);
    }
  };
}
