// src/event-seat/event-seat.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EventSeatService } from './event-seat.service';
import { CreateEventSeatDto } from './dto/create-event-seat.dto';
import { UpdateEventSeatDto } from './dto/update-event-seat.dto';
import { BookEventSeatDto } from './dto/book-event-seat.dot';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventSeatQueryDto } from './dto/event-seat-query.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Controller('api/event-seats')
export class EventSeatController {
  constructor(private readonly eventSeatService: EventSeatService) {}

  // http controllers
  @Post()
  create(@Body() createDto: CreateEventSeatDto) {
    return this.eventSeatService.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/book')
  bookSeat(@Body() bookDto: BookEventSeatDto, @Req() req: RequestWithUser) {
    return this.eventSeatService.book(bookDto, req);
  }

  @Get()
  findAll(@Query() query: EventSeatQueryDto) {
    return this.eventSeatService.findAll(query);
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

  // kafka controllers
  @MessagePattern('create-seats')
  async handleCreateSeats(@Payload() message: any): Promise<void> {
    await this.eventSeatService.handleCreateSeats(message);
  }

  @MessagePattern('create-seat')
  async handleSeatCreation(@Payload() message: any): Promise<void> {
    await this.eventSeatService.handleSeatCreation(message);
  }
}
