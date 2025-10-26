import { Module } from '@nestjs/common';
import { PulsecastBotService } from './pulsecast-bot.service';
import { HttpModule } from '@nestjs/axios';
import { MarkupService } from './markup.service';

@Module({
  imports: [HttpModule],
  providers: [PulsecastBotService, MarkupService],
})
export class PulsecastBotModule {}
