import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  aggregateBestLiveOdds,
  aggregateBestOdds,
} from 'src/utils/helper-functions';

@Injectable()
export class PredictionOracleService {
  private readonly baseUrl = 'https://apiv2.allsportsapi.com/football';

  constructor(private readonly httpService: HttpService) {}

  private async fetchData(params: Record<string, any> = {}) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.baseUrl, {
          params: {
            APIkey: process.env.ALLSPORTS_API_KEY,
            ...params,
          },
        }),
      );
      return response.data.result;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error fetching data from AllSportsAPI',
        error.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 🏆 Get all leagues
   * Example usage: /leagues
   */
  async getLeagues() {
    return this.fetchData({ met: 'Leagues' });
  }

  /**
   * 📅 Get fixtures
   * Example usage: /fixtures?leagueId=1
   */
  async getFixtures(leagueId?: string) {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }),
    );

    const toDate = new Date(now);
    toDate.setDate(now.getDate() + 7);

    const from = now.toISOString().split('T')[0];
    const to = toDate.toISOString().split('T')[0];

    const data = await this.fetchData({ met: 'Fixtures', leagueId, from, to });

    const results = data || [];

    return results.map((match: Record<string, any>) => ({
      // 🏆 Basic match info
      event_key: match.event_key,
      event_date: match.event_date,
      event_time: match.event_time,
      event_status: match.event_status,
      event_live: match.event_live,

      // 🏟️ Location & officials
      // event_stadium: match.event_stadium,
      // event_referee: match.event_referee,

      // ⚽ Scores & results
      // event_halftime_result: match.event_halftime_result,
      // event_final_result: match.event_final_result,
      // event_ft_result: match.event_ft_result,
      // event_penalty_result: match.event_penalty_result,

      // 🧩 Teams
      event_home_team: match.event_home_team,
      home_team_key: match.home_team_key,
      home_team_logo: match.home_team_logo,
      event_home_formation: match.event_home_formation,

      event_away_team: match.event_away_team,
      away_team_key: match.away_team_key,
      away_team_logo: match.away_team_logo,
      event_away_formation: match.event_away_formation,

      // 🌍 League & country info
      league_name: match.league_name,
      league_key: match.league_key,
      league_logo: match.league_logo,
      league_round: match.league_round,
      league_season: match.league_season,
      league_group: match.league_group,

      country_name: match.country_name,
      country_logo: match.country_logo,
      event_country_key: match.event_country_key,

      // 🧑‍🏫 Lineups & formations
      // lineups: match.lineups
      //     ? {
      //         home_team: {
      //             starting_lineups: match.lineups.home_team?.starting_lineups || [],
      //             substitutes: match.lineups.home_team?.substitutes || [],
      //             coaches: match.lineups.home_team?.coaches || [],
      //             missing_players: match.lineups.home_team?.missing_players || [],
      //         },
      //         away_team: {
      //             starting_lineups: match.lineups.away_team?.starting_lineups || [],
      //             substitutes: match.lineups.away_team?.substitutes || [],
      //             coaches: match.lineups.away_team?.coaches || [],
      //             missing_players: match.lineups.away_team?.missing_players || [],
      //         },
      //     }
      //     : null,

      // 🔁 Substitutions
      // substitutes: match.substitutes || [],

      // 🟥 Cards
      // cards: match.cards || [],

      // 📊 Stats
      // statistics: match.statistics || [],

      // ⚡ Other info
      // fk_stage_key: match.fk_stage_key,
      // stage_name: match.stage_name,
    }));
  }

  /**
   * ⚽ Get live scores
   * Example usage: /livescores?matchId=1
   */
  async getLiveScores(leagueId?: string, matchId?: string) {
    const params: any = { met: 'Livescore' };
    if (matchId) {
      params.matchId = matchId;
    }

    if (leagueId) {
      params.leagueId = leagueId;
    }

    const data = await this.fetchData(params);

    const results = data || [];

    return results.map((match: Record<string, any>) => ({
      // 🏆 Basic Info
      event_key: match.event_key,
      event_date: match.event_date,
      event_time: match.event_time,
      event_status: match.event_status, // "74" means 74th minute if live
      event_live: match.event_live === '1',

      // ⚽ Teams
      event_home_team: match.event_home_team,
      home_team_key: match.home_team_key,
      home_team_logo: match.home_team_logo,
      event_home_formation: match.event_home_formation || null,

      event_away_team: match.event_away_team,
      away_team_key: match.away_team_key,
      away_team_logo: match.away_team_logo,
      event_away_formation: match.event_away_formation || null,

      // 🏟️ Venue & Officials
      // event_stadium: match.event_stadium,
      // event_referee: match.event_referee || null,

      // 🧾 Scores
      event_halftime_result: match.event_halftime_result,
      event_final_result: match.event_final_result,
      event_ft_result: match.event_ft_result,
      event_penalty_result: match.event_penalty_result,

      // 🌍 League / Country
      country_name: match.country_name,
      country_logo: match.country_logo,
      event_country_key: match.event_country_key,
      league_name: match.league_name,
      league_key: match.league_key,
      league_logo: match.league_logo,
      league_round: match.league_round,
      league_season: match.league_season || null,
      league_group: match.league_group || null,
      fk_stage_key: match.fk_stage_key,
      stage_name: match.stage_name,

      // 🎯 Match Details
      // goalscorers: match.goalscorers?.map((goal) => ({
      //     time: goal.time,
      //     home_scorer: goal.home_scorer,
      //     away_scorer: goal.away_scorer,
      //     score: goal.score,
      // })) || [],

      // cards: match.cards?.map((card) => ({
      //     time: card.time,
      //     home_fault: card.home_fault,
      //     away_fault: card.away_fault,
      //     card: card.card,
      // })) || [],

      // substitutes: match.substitutes?.map((sub) => ({
      //     time: sub.time,
      //     home_in: sub.home_scorer?.in || null,
      //     home_out: sub.home_scorer?.out || null,
      //     away_in: sub.away_scorer?.in || null,
      //     away_out: sub.away_scorer?.out || null,
      // })) || [],

      // 🧩 Lineups
      // lineups: match.lineups
      //     ? {
      //         home_team: {
      //             starting_lineups:
      //                 match.lineups.home_team?.starting_lineups?.map((p) => ({
      //                     player: p.player,
      //                     number: p.player_number,
      //                     country: p.player_country,
      //                 })) || [],
      //             substitutes:
      //                 match.lineups.home_team?.substitutes?.map((p) => ({
      //                     player: p.player,
      //                     number: p.player_number,
      //                     country: p.player_country,
      //                 })) || [],
      //             coaches:
      //                 match.lineups.home_team?.coaches?.map((c) => ({
      //                     name: c.coache,
      //                     country: c.coache_country,
      //                 })) || [],
      //         },
      //         away_team: {
      //             starting_lineups:
      //                 match.lineups.away_team?.starting_lineups?.map((p) => ({
      //                     player: p.player,
      //                     number: p.player_number,
      //                     country: p.player_country,
      //                 })) || [],
      //             substitutes:
      //                 match.lineups.away_team?.substitutes?.map((p) => ({
      //                     player: p.player,
      //                     number: p.player_number,
      //                     country: p.player_country,
      //                 })) || [],
      //             coaches:
      //                 match.lineups.away_team?.coaches?.map((c) => ({
      //                     name: c.coache,
      //                     country: c.coache_country,
      //                 })) || [],
      //         },
      //     }
      //     : null,

      // 📊 Statistics
      // statistics: match.statistics?.map((stat) => ({
      //     type: stat.type,
      //     home: stat.home,
      //     away: stat.away,
      // })) || [],
    }));
  }

  /**
   * 📅 Get match details
   */
  async getMatchFixture(matchId?: string) {
    const [data, oddsData, liveOddsData] = await Promise.all([
      this.fetchData({ met: 'Fixtures', matchId }),
      this.fetchData({ met: 'Odds', matchId }),
      this.fetchData({ met: 'OddsLive', matchId }),
    ]);

    const results = data || [];

    const matchOdds = oddsData?.[matchId] ?? [];
    const matchLiveOdds = liveOddsData?.[matchId] ?? [];

    const aggregatedMatchOdd = aggregateBestOdds(matchOdds);
    const aggregatedMatchOddLive = aggregateBestLiveOdds(matchLiveOdds);

    return results.map((match: Record<string, any>) => ({
      match_state:
        match.event_status === '' && match.event_live === '0'
          ? 'preMatch'
          : match.event_live === '1'
            ? 'live'
            : 'finished',
      // Odds
      home_odd: aggregatedMatchOdd?.home ?? null,
      draw_odd: aggregatedMatchOdd?.draw ?? null,
      away_odd: aggregatedMatchOdd?.away ?? null,

      home_oddLive: aggregatedMatchOddLive?.home ?? null,
      draw_oddLive: aggregatedMatchOddLive?.draw ?? null,
      away_oddLive: aggregatedMatchOddLive?.away ?? null,

      // Match Info
      event_key: match.event_key,
      event_date: match.event_date,
      event_time: match.event_time,
      event_status: match.event_status,
      event_live: match.event_live,
      event_score: match.event_final_result,

      // Teams
      event_home_team: match.event_home_team,
      home_team_key: match.home_team_key,
      home_team_logo: match.home_team_logo,
      event_away_team: match.event_away_team,
      away_team_key: match.away_team_key,
      away_team_logo: match.away_team_logo,

      // League
      league_name: match.league_name,
      league_key: match.league_key,
      league_logo: match.league_logo,

      country_name: match.country_name,
    }));
  }
}
