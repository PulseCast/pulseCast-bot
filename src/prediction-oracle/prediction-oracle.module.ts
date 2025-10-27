import { Module } from '@nestjs/common';
import { PredictionOracleController } from './prediction-oracle.controller';

@Module({
  controllers: [PredictionOracleController]
})
export class PredictionOracleModule {}
