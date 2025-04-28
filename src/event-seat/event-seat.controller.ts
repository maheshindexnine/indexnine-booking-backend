// src/event-seat/event-seat.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventSeatService } from './event-seat.service';
import { CreateEventSeatDto } from './dto/create-event-seat.dto';
import { UpdateEventSeatDto } from './dto/update-event-seat.dto';

@Controller('api/event-seats')
export class EventSeatController {
  constructor(private readonly eventSeatService: EventSeatService) {}

  @Post()
  create(@Body() createDto: CreateEventSeatDto) {
    return this.eventSeatService.create(createDto);
  }

  @Get()
  findAll() {
    return this.eventSeatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventSeatService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateEventSeatDto) {
    return this.eventSeatService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventSeatService.remove(id);
  }
}
