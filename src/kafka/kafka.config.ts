// src/kafka/kafka.config.ts
import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: ClientProviderOptions = {
  name: 'KAFKA_SERVICE',
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'indexnine-booking-consumer',
    },
  },
};
