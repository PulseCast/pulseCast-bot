import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PulsecastBotService } from './pulsecast-bot.service';
import {
  allFixtures,
  allLiveMatch,
  displayPrivateKeyMarkup,
  exportWalletWarningMarkup,
  leagueAction,
  leaguefixtures,
  leagueLiveMatch,
  leagues,
  resetWalletWarningMarkup,
  walletDetailsMarkup,
} from './markups';
import { UserDocument } from 'src/database/schemas/user.schema';
import { WalletService } from 'src/wallet/wallet.service';
import { USDC } from 'src/utils/constants';
import { PredictionOracleService } from 'src/prediction-oracle/providers/prediction-oracle.service';

@Injectable()
export class MarkupService {
  private logger = new Logger(MarkupService.name);

  constructor(
    private readonly httpService: HttpService,
    private predictionOracle: PredictionOracleService,
    @Inject(forwardRef(() => PulsecastBotService))
    private readonly pulseBotService: PulsecastBotService,
    private readonly walletService: WalletService,
  ) {}

  displayLeagues = async (chatId: string, changeDisplay?: any) => {
    let displayPage;
    console.log(changeDisplay);
    let messageId;
    if (!changeDisplay) {
      displayPage = 'firstDisplay';
    } else {
      displayPage = changeDisplay.buttonPage;
      messageId = changeDisplay.messageId;
    }
    try {
      console.log('message needs to be edited');
      const selectCategory = leagues[displayPage];

      const selectCategoryMarkup = {
        inline_keyboard: selectCategory,
      };

      if (!messageId) {
        await this.pulseBotService.pulseBot.sendMessage(chatId, 'Leagues', {
          reply_markup: selectCategoryMarkup,
        });
        return;
      } else {
        console.log('message needs to be edited');
        await this.pulseBotService.pulseBot.editMessageReplyMarkup(
          selectCategoryMarkup,
          {
            chat_id: chatId,
            message_id: messageId,
          },
        );
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  promptLeagueActions = async (chatId: string, leagueId: string) => {
    try {
      const selectActionPromptMarkup = await leagueAction(leagueId);
      if (selectActionPromptMarkup) {
        const replyMarkup = {
          inline_keyboard: selectActionPromptMarkup.keyboard,
        };
        return await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          selectActionPromptMarkup.message,
          {
            parse_mode: 'HTML',
            reply_markup: replyMarkup,
          },
        );
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  displayLeagueLiveMatches = async (chatId: string, leagueId: string) => {
    try {
      //TODO:FETCH live match API
      const fixtures = await this.predictionOracle.getFixtures(leagueId);

      if (!fixtures || fixtures.length === 0) {
        return await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          'Sorry There is no fixture for this league',
        );
      }
      const leagueLiveMatchMarkup = await leagueLiveMatch(leagueId);
      if (leagueLiveMatchMarkup) {
        const replyMarkup = {
          inline_keyboard: leagueLiveMatchMarkup.keyboard,
        };
        return await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          leagueLiveMatchMarkup.message,
          {
            parse_mode: 'HTML',
            reply_markup: replyMarkup,
          },
        );
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  displayAllLiveMatches = async (chatId: string) => {
    try {
      //TODO:FETCH live match API

      const liveMatchMarkup = await allLiveMatch();
      if (liveMatchMarkup) {
        const replyMarkup = {
          inline_keyboard: liveMatchMarkup.keyboard,
        };
        return await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          liveMatchMarkup.message,
          {
            parse_mode: 'HTML',
            reply_markup: replyMarkup,
          },
        );
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  displayLeagueFixtures = async (chatId: string, leagueId: string) => {
    try {
      //TODO:FETCH fixture API

      const fixtures = await this.predictionOracle.getFixtures(leagueId);

      if (!fixtures || fixtures.length === 0) {
        return await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          'Sorry There is no fixture for this league',
        );
      }
      const leagueFixtureMarkup = await leaguefixtures(leagueId, fixtures);
      if (leagueFixtureMarkup) {
        const replyMarkup = {
          inline_keyboard: leagueFixtureMarkup.keyboard,
        };
        return await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          leagueFixtureMarkup.message,
          {
            parse_mode: 'HTML',
            reply_markup: replyMarkup,
          },
        );
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  displayAllFixture = async (chatId: string) => {
    try {
      //TODO:FETCH fixtures API
      const fixtureMarkup = await allFixtures();
      if (fixtureMarkup) {
        const replyMarkup = {
          inline_keyboard: fixtureMarkup.keyboard,
        };
        return await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          fixtureMarkup.message,
          {
            parse_mode: 'HTML',
            reply_markup: replyMarkup,
          },
        );
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  sendWalletDetails = async (chatId: string, user: UserDocument) => {
    try {
      const { balance } = await this.walletService.getSolBalance(
        user.svmWalletAddress,
        process.env.SOLANA_RPC,
      );
      const { balance: usdcBalance } =
        await this.walletService.getSPLTokenBalance(
          user.svmWalletAddress,
          USDC.address,
          process.env.SOLANA_RPC,
          USDC.decimal,
        );
      const walletDetails = await walletDetailsMarkup(
        user.svmWalletAddress,
        balance,
        usdcBalance,
      );
      if (walletDetailsMarkup!) {
        const replyMarkup = {
          inline_keyboard: walletDetails.keyboard,
        };

        return await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          walletDetails.message,
          {
            parse_mode: 'HTML',
            reply_markup: replyMarkup,
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  showExportWalletWarning = async (chatId: string) => {
    try {
      const showExportWarning = await exportWalletWarningMarkup();
      if (showExportWarning) {
        const replyMarkup = { inline_keyboard: showExportWarning.keyboard };

        return await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          showExportWarning.message,
          {
            parse_mode: 'HTML',
            reply_markup: replyMarkup,
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  displayWalletPrivateKey = async (chatId: string, privateKeySVM: string) => {
    try {
      const displayPrivateKey = await displayPrivateKeyMarkup(privateKeySVM);
      if (displayPrivateKey) {
        const replyMarkup = { inline_keyboard: displayPrivateKey.keyboard };

        const sendPrivateKey = await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          displayPrivateKey.message,
          {
            parse_mode: 'HTML',
            reply_markup: replyMarkup,
          },
        );
        if (sendPrivateKey) {
          // Delay the message deletion by 1 minute
          setTimeout(async () => {
            try {
              // Delete the message after 1 minute
              await this.pulseBotService.pulseBot.deleteMessage(
                chatId,
                sendPrivateKey.message_id,
              );
            } catch (error) {
              console.error('Error deleting message:', error);
            }
          }, 60000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  showResetWalletWarning = async (chatId: string) => {
    try {
      const showResetWarning = await resetWalletWarningMarkup();
      if (showResetWarning) {
        const replyMarkup = { inline_keyboard: showResetWarning.keyboard };

        return await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          showResetWarning.message,
          {
            parse_mode: 'HTML',
            reply_markup: replyMarkup,
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
}
