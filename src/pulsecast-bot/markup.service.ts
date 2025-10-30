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
  marketInterface,
  resetWalletWarningMarkup,
  walletDetailsMarkup,
} from './markups';
import { UserDocument } from 'src/database/schemas/user.schema';
import { WalletService } from 'src/wallet/wallet.service';
import { USDC } from 'src/utils/constants';
import { PredictionOracleService } from 'src/prediction-oracle/providers/prediction-oracle.service';
import { Model } from 'mongoose';
import { Market, MarketDocument } from 'src/database/schemas/market.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Outcome, Session } from 'src/database/schemas/session.schema';

@Injectable()
export class MarkupService {
  private logger = new Logger(MarkupService.name);

  constructor(
    private readonly httpService: HttpService,
    private predictionOracle: PredictionOracleService,
    @Inject(forwardRef(() => PulsecastBotService))
    private readonly pulseBotService: PulsecastBotService,
    private readonly walletService: WalletService,
    @InjectModel(Market.name) private readonly marketModel: Model<Market>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
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
      const liveMatches = await this.predictionOracle.getLiveScores(
        leagueId,
        null,
      );

      if (!liveMatches || liveMatches.length === 0) {
        return await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          'ℹ️ There are no live games currently in progress',
        );
      }
      console.log(liveMatches);
      const leagueLiveMatchMarkup = await leagueLiveMatch(
        leagueId,
        liveMatches,
      );
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

  displayMarketInterface = async (
    chatId: string,
    matchId: string,
    isgroup: boolean = false,
  ) => {
    try {
      console.log(isgroup);
      let existingMarket = null;
      if (isgroup) {
        existingMarket = await this.marketModel.findOne({
          matchKey: matchId,
          groupId: chatId,
        });
      } else {
        existingMarket = await this.marketModel.findOne({ matchKey: matchId });
      }

      const match = await this.predictionOracle.getMatchFixture(matchId);

      const marketData = await this.calculateMarketProbability(
        match[0],
        existingMarket,
      );

      if (!match || match.length === 0) {
        return await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          'Sorry There is no market for this fixture',
        );
      }
      const market = marketInterface(matchId, match[0], marketData);
      if (market) {
        const replyMarkup = {
          inline_keyboard: market.keyboard,
        };
        return await this.pulseBotService.pulseBot.sendMessage(
          chatId,
          market.message,
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

  calculateMarketProbability = async (
    match: any,
    market?: MarketDocument,
    alphaBase = 0.3, // oracle base trust
    betaBase = 0.7, // market base trust
  ) => {
    const {
      home_odd,
      draw_odd,
      away_odd,
      home_oddLive,
      draw_oddLive,
      away_oddLive,
    } = match;

    // Step 1: Use live odds if available and non-zero
    const finalHomeOdd =
      home_oddLive != null && home_oddLive !== 0 ? home_oddLive : home_odd;
    const finalDrawOdd =
      draw_oddLive != null && draw_oddLive !== 0 ? draw_oddLive : draw_odd;
    const finalAwayOdd =
      away_oddLive != null && away_oddLive !== 0 ? away_oddLive : away_odd;

    // Step 2: Convert odds to probabilities
    const pHome = 1 / finalHomeOdd;
    const pDraw = 1 / finalDrawOdd;
    const pAway = 1 / finalAwayOdd;

    // Step 3: Market pot probabilities
    const homePot = +(market?.potHome ?? 0);
    const drawPot = +(market?.potDraw ?? 0);
    const awayPot = +(market?.potAway ?? 0);
    const totalPot = homePot + drawPot + awayPot;

    let homePotP: number, drawPotP: number, awayPotP: number;

    if (totalPot === 0) {
      // Fallback if no bets yet
      homePotP = 1 / 3;
      drawPotP = 1 / 3;
      awayPotP = 1 / 3;
    } else {
      homePotP = homePot / totalPot;
      drawPotP = drawPot / totalPot;
      awayPotP = awayPot / totalPot;
    }

    // Step 4: Dynamic weights with base alpha/beta
    const confidenceScale = 10; // small scale so tiny bets shift probabilities
    const marketConfidence = totalPot / (totalPot + confidenceScale);

    // Combine with base weights
    let alpha = alphaBase * (1 - marketConfidence);
    let beta = betaBase + (1 - betaBase) * marketConfidence;

    // Optional: ensure minimum oracle influence
    alpha = Math.max(alpha, 0.05);
    beta = 1 - alpha;

    // Step 5: Combine oracle and market probabilities
    const marketHomeP = pHome * alpha + homePotP * beta;
    const marketDrawP = pDraw * alpha + drawPotP * beta;
    const marketAwayP = pAway * alpha + awayPotP * beta;

    // Step 6: Normalize to sum = 1
    const totalP = marketHomeP + marketDrawP + marketAwayP;
    const normalizedHomeP = marketHomeP / totalP;
    const normalizedDrawP = marketDrawP / totalP;
    const normalizedAwayP = marketAwayP / totalP;

    return {
      home: +normalizedHomeP.toFixed(3),
      draw: +normalizedDrawP.toFixed(3),
      away: +normalizedAwayP.toFixed(3),
      homePot,
      drawPot,
      awayPot,
      totalPot,
    };
  };

  promptBuyAmount = async (
    chatId: string,
    matchId: string,
    user: UserDocument,
    outcome: Outcome,
  ) => {
    try {
      const { balance: usdcBalance } =
        await this.walletService.getSPLTokenBalance(
          user.svmWalletAddress,
          USDC.address,
          process.env.SOLANA_RPC,
          USDC.decimal,
        );

      await this.sessionModel.deleteMany({ chatId: chatId });

      await this.sessionModel.create({
        chatId: chatId,
        buyPositionAmount: true,
        outcome,
        matchId,
      });
      await this.pulseBotService.pulseBot.sendMessage(
        chatId,
        `Buyin <b>$${outcome}</b> position.\n` +
          `Reply with the amount of USDC you wish to use (0 - ${usdcBalance}, e.g., 10).\n`,
        {
          parse_mode: 'HTML',
          reply_markup: {
            force_reply: true,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  // calculateMarketProbability = async (match: any, market: MarketDocument) => {
  //   const {
  //     home_odd,
  //     draw_odd,
  //     away_odd,
  //     home_oddLive,
  //     draw_oddLive,
  //     away_oddLive,
  //   } = match;

  //   // Use live odds if available and non-zero
  //   const finalHomeOdd =
  //     home_oddLive != null && home_oddLive !== 0 ? home_oddLive : home_odd;
  //   const finalDrawOdd =
  //     draw_oddLive != null && draw_oddLive !== 0 ? draw_oddLive : draw_odd;
  //   const finalAwayOdd =
  //     away_oddLive != null && away_oddLive !== 0 ? away_oddLive : away_odd;

  //   // Convert odds to probabilities
  //   const pHome = 1 / finalHomeOdd;
  //   const pDraw = 1 / finalDrawOdd;
  //   const pAway = 1 / finalAwayOdd;

  //   // Market pot probabilities
  //   const homePot = +market.potHome;
  //   const drawPot = +market.potDraw;
  //   const awayPot = +market.potAway;
  //   const totalPot = homePot + drawPot + awayPot;

  //   const homePotP = homePot / totalPot;
  //   const drawPotP = drawPot / totalPot;
  //   const awayPotP = awayPot / totalPot;

  //   // Combined probability using weights alpha and beta
  //   const marketHomeP = pHome * alpha + homePotP * beta;
  //   const marketDrawP = pDraw * alpha + drawPotP * beta;
  //   const marketAwayP = pAway * alpha + awayPotP * beta;

  //   // Optional: normalize so they sum to 1
  //   const totalP = marketHomeP + marketDrawP + marketAwayP;
  //   const normalizedHomeP = marketHomeP / totalP;
  //   const normalizedDrawP = marketDrawP / totalP;
  //   const normalizedAwayP = marketAwayP / totalP;

  //   return {
  //     home: normalizedHomeP,
  //     draw: normalizedDrawP,
  //     away: normalizedAwayP,
  //     homePot,
  //     drawPot,
  //     awayPot,
  //     totalPot,
  //   };
  // };
}
