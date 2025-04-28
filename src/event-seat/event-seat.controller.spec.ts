import { Test, TestingModule } from '@nestjs/testing';
import { EventSeatController } from './event-seat.controller';

describe('EventSeatController', () => {
  let controller: EventSeatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventSeatController],
    }).compile();

    controller = module.get<EventSeatController>(EventSeatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
