import { Controller, Get, Query } from '@nestjs/common';
import { PredictionOracleService } from './providers/prediction-oracle.service';

@Controller('prediction-oracle')
export class PredictionOracleController {
  constructor(
    private readonly predictionOracleService: PredictionOracleService,
  ) {}

  @Get('leagues')
  async getLeagues() {
    return await this.predictionOracleService.getLeagues();
  }

  @Get('fixtures')
  async getFixtures(@Query() dto: { leagueId?: string }) {
    return await this.predictionOracleService.getFixtures(dto.leagueId);
  }

  @Get('livescores')
  async getLiveScores(@Query() dto: { matchId?: string }) {
    return await this.predictionOracleService.getLiveScores(null, dto.matchId);
  }

  @Get('match')
  async geMatchDetails(@Query() dto: { matchId?: string }) {
    return await this.predictionOracleService.getMatchFixture(dto.matchId);
  }
}
