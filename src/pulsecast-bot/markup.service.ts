import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { HttpService } from '@nestjs/axios';
import { PulsecastBotService } from './pulsecast-bot.service';

@Injectable()
export class MarkupService {
  private logger = new Logger(MarkupService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly pulseBotService: PulsecastBotService,
  ) {}

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
