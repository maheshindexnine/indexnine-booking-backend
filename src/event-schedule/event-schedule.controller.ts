// src/event-schedule/event-schedule.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EventScheduleService } from './event-schedule.service';
import { CreateEventScheduleDto } from './dto/create-event-schedule.dto';
import { UpdateEventScheduleDto } from './dto/update-event-schedule.dto';
import { EventScheduleQueryDto } from './dto/event-schedule-query.dto';

@Controller('api/event-schedules')
export class EventScheduleController {
  constructor(private readonly eventScheduleService: EventScheduleService) {}

  @Post()
  create(@Body() createDto: CreateEventScheduleDto) {
    return this.eventScheduleService.create(createDto);
  }

  @Get()
  findAll(@Query() query: EventScheduleQueryDto) {
    return this.eventScheduleService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventScheduleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateEventScheduleDto) {
    return this.eventScheduleService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventScheduleService.remove(id);
  }
}
