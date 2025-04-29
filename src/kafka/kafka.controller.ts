// kafka.controller.ts

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class KafkaController {
  @MessagePattern('test-topic')
  handleTestTopic(@Payload() message: any) {
    console.log('✅ Received from Kafka:', message);

    return {
      ack: true,
      receivedMessage: message,
      reply: 'Successfully processed',
    };
  }
}
