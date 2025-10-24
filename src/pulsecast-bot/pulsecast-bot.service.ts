import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { HttpService } from '@nestjs/axios';

const token = process.env.TELEGRAM_TOKEN;
@Injectable()
export class PulsecastBotService {
  private readonly pulseBot: TelegramBot;
  private logger = new Logger(PulsecastBotService.name);

  constructor(private readonly httpService: HttpService) {
    this.pulseBot = new TelegramBot(token, { polling: true });
    this.pulseBot.on('message', this.handleRecievedMessages);
    this.pulseBot.on('callback_query', this.handleButtonCommands);
  }

  handleRecievedMessages = async (msg: any) => {
    this.logger.debug(msg);
    try {
    } catch (error) {
      console.error(error);
    }
  };

  handleButtonCommands = async (query: any) => {
    this.logger.debug(query);

    function isJSON(str) {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }

    if (isJSON(query.data)) {
      try {
      } catch (error) {
        console.log(error);
      }
    }
  };
}
