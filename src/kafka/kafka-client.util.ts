// src/kafka/kafka-client.util.ts

import { DynamicModule, Provider } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaMockClient } from './kafka.mock';

export function getKafkaClientModule(): DynamicModule[] {
  const enableKafka = process.env.ENABLE_KAFKA === 'true';

  if (!enableKafka) {
    console.log('❌ Kafka is disabled, using mock provider.');

    const mockKafkaProvider: Provider = {
      provide: 'KAFKA_SERVICE',
      useClass: KafkaMockClient,
    };

    return [
      {
        module: class KafkaMockModule {},
        providers: [mockKafkaProvider],
        exports: [mockKafkaProvider],
      },
    ];
  }

  console.log('✅ Kafka is enabled, using real provider.');
  return [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'indexnine-booking-client',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID || 'indexnine-booking-consumer',
          },
        },
      },
    ]),
  ];
}
