// import { HttpService } from '@nestjs/axios';
// import { Injectable, Logger } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Market } from 'src/database/schemas/market.schema';

// @Injectable()
// export class PotService {
//   private logger = new Logger(PotService.name);
//   constructor(
//     private readonly httpService: HttpService,
//     @InjectModel(Market.name) private readonly marketModel: Model<Market>,
//   ) {}
//   async addLiquidity(marketId: string, amount: number) {
//     //TODO: WALLET transaction
//     //TODO: get transaction status and amount
//     // Add to market liquidity
//     await this.marketModel.findByIdAndUpdate(marketId, {
//       $inc: { liquidity: amount },
//     });
//   }

//   async getPotBalance(matchId: string) {
//     return await this.marketModel.find({ matchId });
//   }
// }
