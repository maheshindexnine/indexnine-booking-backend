import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('test-topic');
    await this.kafkaClient.connect();
    console.log('✅ Kafka client connected!');
  }

  async sendMessage(message: any): Promise<any> {
    const response$ = this.kafkaClient.send('test-topic', message);
    const response = await firstValueFrom(response$);
    return response;
  }
}
