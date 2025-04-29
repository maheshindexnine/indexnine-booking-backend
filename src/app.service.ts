// app.service.ts
import { Inject, Injectable, Optional } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly enableKafka: boolean;

  constructor(
    @Optional()
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {
    this.enableKafka = process.env.ENABLE_KAFKA === 'true';
  }

  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    if (this.enableKafka && this.kafkaClient) {
      this.kafkaClient.subscribeToResponseOf('test-topic');
      await this.kafkaClient.connect();
      console.log('✅ Kafka client connected!');
    } else {
      console.log('❌ Kafka client NOT connected (disabled via env)');
    }
  }

  async sendMessage(message: any): Promise<any> {
    if (!this.enableKafka || !this.kafkaClient) {
      console.log('❌ Kafka is disabled. Skipping message send.');
      return { ack: false, message: 'Kafka disabled' };
    }

    const response$ = this.kafkaClient.send('test-topic', message);
    const response = await firstValueFrom(response$);
    return response;
  }
}
