import { Test, TestingModule } from '@nestjs/testing';
import { PulsecastBotService } from './pulsecast-bot.service';

describe('PulsecastBotService', () => {
  let service: PulsecastBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PulsecastBotService],
    }).compile();

    service = module.get<PulsecastBotService>(PulsecastBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
