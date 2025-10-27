import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { HttpService } from '@nestjs/axios';
import { acceptDisclaimerMessageMarkup, welcomeMessageMarkup } from './markups';
import { MarkupService } from './markup.service';

@Injectable()
export class PulsecastBotService {
  readonly pulseBot: TelegramBot;
  private logger = new Logger(PulsecastBotService.name);
  private token = process.env.TELEGRAM_TOKEN;

  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => MarkupService))
    private readonly markupService: MarkupService,
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

      console.log(msg.text);
      const command = msg.text.trim();

      if (command === '/start' && msg.chat.type === 'private') {
        const username = `${msg.from.username}`;

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
    // let slug: string;

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

    // function to split country from language
    function splitword(word) {
      return word.split('_');
    }

    if (isJSON(query.data)) {
      command = JSON.parse(query.data).command;
      //   userChatId = JSON.parse(query.data).userChatId;
      action = JSON.parse(query.data).action;
      //   slug = JSON.parse(query.data).slug;
    } else {
      command = query.data;
    }

    try {
      switch (command) {
        case '/acceptDisclaimer':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');

          //TODO: MAKE USER ACCEPTDISCLAIMER AS TRUE
          const allFeatures = await acceptDisclaimerMessageMarkup();
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

        case '/categories':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
          await this.markupService.displayLeagues(chatId);
          return;

        case '/nextCatePage':
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

        case '/prevCatePage':
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

        case '/close':
          await this.pulseBot.sendChatAction(query.message.chat.id, 'typing');
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

  getKeyboard(page = 0) {
    // List of buttons
    const buttons = [
      'Button 1',
      'Button 2',
      'Button 3',
      'Button 4',
      'Button 5',
    ];
    const pageSize = 2;
    const start = page * pageSize;
    const pageButtons = buttons
      .slice(start, start + pageSize)
      .map((text) => [{ text, callback_data: text }]);

    // Add navigation
    const nav = [];
    if (page > 0) nav.push({ text: '⬅️ Prev', callback_data: 'prev' });
    if ((page + 1) * pageSize < buttons.length)
      nav.push({ text: 'Next ➡️', callback_data: 'next' });
    if (nav.length) pageButtons.push(nav);

    return { inline_keyboard: pageButtons };
  }
}
