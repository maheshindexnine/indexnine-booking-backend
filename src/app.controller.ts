import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  

  @Post('send-kafka')
  async sendKafka(@Body() body: any) {
    const result = await this.appService.sendMessage(body);
    return {
      message: 'Kafka message sent and response received',
      data: result,
    };
  }
}
