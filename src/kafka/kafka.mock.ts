// src/kafka/kafka.mock.ts
export class KafkaMockClient {
  emit() {
    console.log('[Mock Kafka] emit called');
    return {
      toPromise: async () => {}, // mimic Kafka behavior
    };
  }
}
