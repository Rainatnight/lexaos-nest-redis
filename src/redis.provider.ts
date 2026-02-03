import { createClient } from 'redis';

export const RedisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    client.on('error', (err) => {
      console.error('Redis error', err);
    });

    await client.connect();
    return client;
  },
};
