import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PulsecastBotService } from './pulsecast-bot.service';
import { marketCategories } from './markups';

@Injectable()
export class MarkupService {
  private logger = new Logger(MarkupService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => PulsecastBotService))
    private readonly pulseBotService: PulsecastBotService,
  ) {}

  //   getKeyboard(page = 0) {
  //     // List of buttons
  //     const buttons = [
  //       'Button 1',
  //       'Button 2',
  //       'Button 3',
  //       'Button 4',
  //       'Button 5',
  //     ];
  //     const pageSize = 2;
  //     const start = page * pageSize;
  //     const pageButtons = buttons
  //       .slice(start, start + pageSize)
  //       .map((text) => [{ text, callback_data: text }]);

  //     // Add navigation
  //     const nav = [];
  //     if (page > 0) nav.push({ text: '⬅️ Prev', callback_data: 'prev' });
  //     if ((page + 1) * pageSize < buttons.length)
  //       nav.push({ text: 'Next ➡️', callback_data: 'next' });
  //     if (nav.length) pageButtons.push(nav);

  //     return { inline_keyboard: pageButtons };
  //   }

  displayMarketCateories = async (chatId: string, changeDisplay?) => {
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
      const selectCategory = marketCategories[displayPage];

      const selectCategoryMarkup = {
        inline_keyboard: selectCategory,
      };

      if (!messageId) {
        await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          'Market Categories',
          {
            reply_markup: selectCategoryMarkup,
          },
        );
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
}
