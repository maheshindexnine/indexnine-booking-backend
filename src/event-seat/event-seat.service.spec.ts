import { Test, TestingModule } from '@nestjs/testing';
import { EventSeatService } from './event-seat.service';

describe('EventSeatService', () => {
  let service: EventSeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventSeatService],
    }).compile();

    service = module.get<EventSeatService>(EventSeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
