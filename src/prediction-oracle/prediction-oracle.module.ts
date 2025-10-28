import { Module } from '@nestjs/common';
import { PredictionOracleController } from './prediction-oracle.controller';
import { PredictionOracleService } from './providers/prediction-oracle.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [PredictionOracleController],
  providers: [PredictionOracleService],
  imports: [HttpModule]
})
export class PredictionOracleModule {}
