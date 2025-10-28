import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PulsecastBotService } from './pulsecast-bot.service';
import {
  allFixtures,
  allLiveMatch,
  leagueAction,
  leaguefixtures,
  leagueLiveMatch,
  leagues,
} from './markups';

@Injectable()
export class MarkupService {
  private logger = new Logger(MarkupService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => PulsecastBotService))
    private readonly pulseBotService: PulsecastBotService,
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
      const leagueFixtureMarkup = await leaguefixtures(leagueId);
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
}
