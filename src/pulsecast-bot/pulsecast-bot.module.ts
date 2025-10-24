import { Module } from '@nestjs/common';
import { PulsecastBotService } from './pulsecast-bot.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PulsecastBotService],
})
export class PulsecastBotModule {}
