import { Module } from '@nestjs/common';
import { PulsecastBotService } from './pulsecast-bot.service';

@Module({
  providers: [PulsecastBotService],
})
export class PulsecastBotModule {}
