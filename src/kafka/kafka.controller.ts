// kafka.controller.ts

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class KafkaController {
  @MessagePattern('test-topic')
  handleTestTopic(@Payload() message: any) {
    console.log('✅ Received from Kafka:', message.value);

    return {
      ack: true,
      receivedMessage: message.value,
      reply: 'Successfully processed',
    };
  }
}
