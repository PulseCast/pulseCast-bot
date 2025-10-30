import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, startSession } from 'mongoose';
import {
  Market,
  MarketDocument,
  MarketStatus,
} from 'src/database/schemas/market.schema';
import { Match } from 'src/database/schemas/match.schema';
import { Position } from 'src/database/schemas/position.schema';
import { Outcome } from 'src/database/schemas/session.schema';
import { User } from 'src/database/schemas/user.schema';
import { PredictionOracleService } from 'src/prediction-oracle/providers/prediction-oracle.service';
import { MarkupService } from 'src/pulsecast-bot/markup.service';
import { USDC } from 'src/utils/constants';
import { parseScore } from 'src/utils/helper-functions';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class TradeService {
  constructor(
    @InjectModel(Market.name) private marketModel: Model<Market>,
    @InjectModel(Position.name) private positionModel: Model<Position>,
    private predictionOracle: PredictionOracleService,
    private markupService: MarkupService,
    private readonly walletService: WalletService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  /** BUY — user stakes amount → receives shares */
  async buy(
    chatId: string,
    matchId: string,
    side: Outcome,
    stake: number,
    groupId?: string,
  ) {
    let market;
    let entryProbability;
    let tx = null;
    let user;
    // let homeTeamAKA;
    // let awayTeamAKA;
    // let shareAKA;

    // console.log(matchId);
    // return;
    const query: any = { matchKey: matchId };
    if (groupId != null) {
      query.groupId = groupId;
    }

    market = await this.marketModel.findOne(query);
    const match = await this.predictionOracle.getMatchFixture(matchId);
    const matchState =
      match.event_status === '' && match.event_live === '0'
        ? 'pre'
        : match.event_live === '1'
          ? 'live'
          : 'finished';

    const calculatedmarketData =
      await this.markupService.calculateMarketProbability(match[0], market);

    let pricePerShare: number;
    const outcomePot = { potHome: 0, potDraw: 0, potAway: 0 };

    if (side === Outcome.AWAY_WIN) {
      pricePerShare = calculatedmarketData.away;
      outcomePot.potAway += stake;
      entryProbability = calculatedmarketData.away;
    } else if (side === Outcome.HOME_WIN) {
      pricePerShare = calculatedmarketData.home;
      outcomePot.potHome += stake;
      entryProbability = calculatedmarketData.home;
    } else if (side === Outcome.DRAW) {
      pricePerShare = calculatedmarketData.draw;
      outcomePot.potDraw += stake;
      entryProbability = calculatedmarketData.draw;
    } else {
      throw new Error('Invalid outcome');
    }

    // Shares = stake / price
    const shares = stake / pricePerShare;

    // homeTeamAKA = toAcronym(match.event_home_team);
    // awayTeamAKA = toAcronym(match.event_away_team);

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      user = await this.userModel.findOne({
        chatId,
      });
      const encryptedSVMWallet = await this.walletService.decryptSVMWallet(
        `${process.env.DEFAULT_WALLET_PIN}`,
        user.svmWalletDetails,
      );

      const { balance: usdcBalance } =
        await this.walletService.getSPLTokenBalance(
          user.svmWalletAddress,
          USDC.address,
          process.env.SOLANA_RPC,
          USDC.decimal,
        );

      if (usdcBalance < stake) {
        return {
          message: `Insuffcient wallet balance - ${usdcBalance} USDC`,
        };
      }
      tx = await this.walletService.transferSPLToken(
        encryptedSVMWallet.privateKey,
        process.env.PULSE_POT_WALLET,
        stake,
        USDC.address,
        process.env.SOLANA_RPC,
        USDC.decimal,
        `Buying ${shares} of $${side} @${pricePerShare}`,
      );
      // Increase the pot for that side
      if (!market) {
        // Save trade position
        market = await this.marketModel.create(
          [
            {
              matchKey: matchId,
              status: matchState,
              potHome: outcomePot.potHome.toString(),
              potAway: outcomePot.potAway.toString(),
              potDraw: outcomePot.potDraw.toString(),
              homeProbability: calculatedmarketData.home,
              drawProbability: calculatedmarketData.draw,
              awayProbability: calculatedmarketData.away,
              totalPot: (
                outcomePot.potHome +
                outcomePot.potAway +
                outcomePot.potDraw
              ).toString(),
              groupId,
            },
          ],
          { session },
        );
        market = market[0];

        console.log(match.event_score);
        const score = parseScore(match.event_score);
        const homeTeam = {
          name: match.event_home_team,
          key: match.home_team_key,
        };
        const awayTeam = {
          name: match.event_away_team,
          key: match.away_team_key,
        };
        await this.matchModel.create(
          [
            {
              matchKey: matchId,
              leagueKey: match.league_key,
              homeTeam,
              awayTeam,
              startTime: match.event_time,
              status: matchState,
              homeScore: score.homeScore,
              awayScore: score.awayScore,
            },
          ],
          { session },
        );
      } else {
        const newPotAway = Number(market.potAway) + Number(outcomePot.potAway);
        const newPotHome = Number(market.potHome) + Number(outcomePot.potHome);
        const newPotDraw = Number(market.potDraw) + Number(outcomePot.potDraw);

        const newTotalPot = newPotAway + newPotHome + newPotDraw;

        await this.marketModel.updateOne(
          { _id: market._id },
          {
            potAway: newPotAway.toString(),
            potHome: newPotHome.toString(),
            potDraw: newPotDraw.toString(),
            totalPot: newTotalPot.toString(),
          },
          { session },
        );
      }

      console.log(market);
      // Save trade position
      await this.positionModel.create(
        [
          {
            user: user._id.toString(),
            market: market._id.toString(),
            side,
            entryProbability: entryProbability.toString(),
            shares: shares.toString(),
            remainingShares: shares.toString(),
            stakePaid: stake.toString(),
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return {
        ok: true,
        message: `Bought ${shares.toFixed(6)} $${side} shares @${pricePerShare.toFixed(2)}`,
        shares,
        price: pricePerShare,
        tx: tx.signature,
      };
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
      let refundTx;
      if (tx.signature && user) {
        refundTx = await this.walletService.transferSPLToken(
          process.env.PULSE_POT_KEY,
          user.svmWalletAddress,
          stake,
          USDC.address,
          process.env.SOLANA_RPC,
          USDC.decimal,
          `Refunding failed transaction`,
        );
      }

      return {
        message: `Failed transaction`,
        tx: refundTx.signature,
      };
    }
  }

  /** CASHOUT — sell shares back at current market price */
  /** CASHOUT — user burns shares to withdraw stake early */
  async cashout(
    chatId: string,
    matchId: string,
    positionId: string, // identifies which position they want to partially or fully cashout
    sharesToSell: number,
    groupId?: string,
  ) {
    const query: any = { matchKey: matchId };
    if (groupId != null) query.groupId = groupId;

    const market = await this.marketModel.findOne(query);
    if (!market) throw new Error('Market not found');

    const position = await this.positionModel.findById(positionId);
    if (!position) throw new Error('Position not found');

    if (
      position.user.toString() !==
      (await this.userModel.findOne({ chatId }))._id.toString()
    ) {
      throw new Error('Unauthorized');
    }

    // Cannot sell more shares than remaining
    if (sharesToSell > Number(position.remainingShares)) {
      throw new Error('Not enough shares to sell');
    }

    // Get latest price again (same as BUY logic)
    const match = await this.predictionOracle.getMatchFixture(matchId);
    const calculatedmarketData =
      await this.markupService.calculateMarketProbability(match[0], market);

    let currentPrice: number;
    if (position.side === Outcome.HOME_WIN)
      currentPrice = calculatedmarketData.home;
    else if (position.side === Outcome.AWAY_WIN)
      currentPrice = calculatedmarketData.away;
    else if (position.side === Outcome.DRAW)
      currentPrice = calculatedmarketData.draw;
    else throw new Error('Invalid outcome');

    // Cashout payout = shares * currentPrice
    const cashoutAmount = sharesToSell * currentPrice;

    // Check if pot has enough to pay out
    let potField: 'potHome' | 'potAway' | 'potDraw';
    if (position.side === Outcome.HOME_WIN) potField = 'potHome';
    else if (position.side === Outcome.AWAY_WIN) potField = 'potAway';
    else potField = 'potDraw';

    const currentPot = Number(market[potField]);

    // 🚫 No exit liquidity → deny cashout
    if (cashoutAmount > currentPot) {
      return {
        ok: false,
        message: `Not enough liquidity to cash out right now.`,
      };
    }

    // Prepare wallet transfer
    const user = await this.userModel.findOne({ chatId });

    const session = await startSession();
    session.startTransaction();

    try {
      // Send payout
      const tx = await this.walletService.transferSPLToken(
        process.env.PULSE_POT_KEY,
        user.svmWalletAddress,
        cashoutAmount,
        USDC.address,
        process.env.SOLANA_RPC,
        USDC.decimal,
        `Cashout ${sharesToSell} shares of $${position.side} @${currentPrice}`,
      );

      // Update pot
      const updatedPot = (currentPot - cashoutAmount).toString();
      await this.marketModel.updateOne(
        { _id: market._id },
        {
          [potField]: updatedPot,
          totalPot: (
            Number(market.potHome) +
            Number(market.potAway) +
            Number(market.potDraw) -
            cashoutAmount
          ).toString(),
        },
        { session },
      );

      // Burn shares
      const newRemaining = Number(position.remainingShares) - sharesToSell;
      await this.positionModel.updateOne(
        { _id: position._id },
        { remainingShares: newRemaining.toString() },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return {
        ok: true,
        message: `Cashed out ${sharesToSell.toFixed(6)} shares for ${cashoutAmount.toFixed(4)} USDC`,
        sharesSold: sharesToSell,
        received: cashoutAmount,
        tx: tx.signature,
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  /** VIEW user open positions */
  /** GET USER POSITIONS (active + optional settled) */
  async getUserPositions(chatId: string) {
    const user = await this.userModel.findOne({ chatId });
    if (!user) throw new Error('User not found');

    const positionQuery: any = { user: user._id };

    // Get user positions
    const positions = await this.positionModel
      .find(positionQuery)
      .populate<{ market: MarketDocument }>('market');

    if (positions.length === 0) {
      return {
        ok: true,
        message: `You have no open positions.`,
        positions: [],
      };
    }

    const results = [];
    for (const pos of positions) {
      const market = pos.market;

      // If market is settled → no need to compute live prices
      if (market.status === MarketStatus.SETTLED) {
        results.push({
          matchKey: market.matchKey,
          side: pos.side,
          shares: Number(pos.shares),
          remainingShares: Number(pos.remainingShares),
          entryProbability: Number(pos.entryProbability),
          status: MarketStatus.SETTLED,
          finalPayout: pos.finalPayout ? Number(pos.finalPayout) : 0,
        });
        continue;
      }

      // Live positions → compute current price again
      const fixture = await this.predictionOracle.getMatchFixture(
        market.matchKey,
      );
      const marketData = await this.markupService.calculateMarketProbability(
        fixture[0],
        market,
      );

      let currentPrice: number;
      if (pos.side === Outcome.HOME_WIN) currentPrice = marketData.home;
      else if (pos.side === Outcome.AWAY_WIN) currentPrice = marketData.away;
      else if (pos.side === Outcome.DRAW) currentPrice = marketData.draw;

      // Potential cashout = remainingShares * currentPrice
      const remaining = Number(pos.remainingShares);
      const potentialCashout = remaining * currentPrice;

      results.push({
        matchId: market.matchKey,
        side: pos.side,
        shares: Number(pos.shares),
        remainingShares: remaining,
        entryProbability: Number(pos.entryProbability),
        currentPrice,
        potentialCashout,
        status: market.status.toUpperCase(),
      });
    }

    return {
      ok: true,
      positions: results,
    };
  }

  /** SETTLE — finalize match outcome and pay all winners */
  async settleMatch(matchId: string, groupId?: string) {
    const query: any = { matchKey: matchId };
    if (groupId != null) query.groupId = groupId;

    const market = await this.marketModel.findOne(query);
    if (!market) throw new Error('Market not found');

    if (market.status === 'settled') {
      return { ok: false, message: 'Market already settled' };
    }

    // 1. Get final match result
    const match = await this.predictionOracle.getMatchFixture(matchId);
    const score = parseScore(match.event_score);

    let winnerSide: Outcome;
    if (score.homeScore > score.awayScore) winnerSide = Outcome.HOME_WIN;
    else if (score.awayScore > score.homeScore) winnerSide = Outcome.AWAY_WIN;
    else winnerSide = Outcome.DRAW;

    // 2. Get all positions in this market
    const positions = await this.positionModel.find({ market: market._id });

    // 3. Sum winning-side remaining shares
    let totalWinningShares = 0;
    positions.forEach((pos) => {
      if (pos.side === winnerSide) {
        totalWinningShares += Number(pos.remainingShares);
      }
    });

    const totalPot = Number(market.totalPot);

    // If nobody bet the winning side → book ends entire pot (rare but possible)
    if (totalWinningShares === 0) {
      await this.marketModel.updateOne(
        { _id: market._id },
        { status: 'settled' },
      );
      await this.matchModel.updateOne(
        { matchKey: matchId },
        { finalOutcome: winnerSide },
      );
      return { ok: true, message: `No winners. Liquidity retained.` };
    }

    // 4. Compute payout per share
    const payoutPerShare = totalPot / totalWinningShares;

    const session = await startSession();
    session.startTransaction();

    try {
      for (const pos of positions) {
        const remaining = Number(pos.remainingShares);

        // Losers get 0
        if (pos.side !== winnerSide || remaining <= 0) {
          await this.positionModel.updateOne(
            { _id: pos._id },
            { settled: true, finalPayout: '0' },
            { session },
          );
          continue;
        }

        // Winner payout
        const payoutAmount = remaining * payoutPerShare;

        // Transfer SPL Token
        const user = await this.userModel.findById(pos.user);

        await this.walletService.transferSPLToken(
          process.env.PULSE_POT_KEY,
          user.svmWalletAddress,
          payoutAmount,
          USDC.address,
          process.env.SOLANA_RPC,
          USDC.decimal,
          `Match Settlement Payout`,
        );

        // Mark position as settled
        await this.positionModel.updateOne(
          { _id: pos._id },
          { settled: true, finalPayout: payoutAmount.toString() },
          { session },
        );
      }

      // Mark market as settled
      await this.marketModel.updateOne(
        { _id: market._id },
        { status: 'settled' },
        { session },
      );

      await this.matchModel.updateOne(
        { matchKey: matchId },
        { finalOutcome: winnerSide },
      );

      await session.commitTransaction();
      session.endSession();

      return {
        ok: true,
        message: `✅ Settlement complete. Winner: ${winnerSide}`,
        payoutPerShare,
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
}
