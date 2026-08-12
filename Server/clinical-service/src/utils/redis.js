import Redis from 'ioredis';

let redisClient = null;

export const getRedis = () => {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    redisClient.on('connect', () => console.log('[Clinical Service] Redis connected'));
    redisClient.on('error', (err) => console.error('[Clinical Service] Redis error:', err.message));
  }
  return redisClient;
};

export const acquireSlotLock = async (therapistId, date, startTime, requestId) => {
  try {
    const redis = getRedis();
    const key = `lock:slot:${therapistId}:${date}:${startTime}`;
    const ttl = parseInt(process.env.SLOT_LOCK_TTL_SECONDS) || 5;
    const result = await redis.set(key, requestId, 'NX', 'EX', ttl);
    return result === 'OK';
  } catch (err) {
    console.warn('[Clinical Service] Redis lock bypass (Redis unreachable):', err.message);
    return true; // Fallback if Redis is down
  }
};

export const releaseSlotLock = async (therapistId, date, startTime, requestId) => {
  try {
    const redis = getRedis();
    const key = `lock:slot:${therapistId}:${date}:${startTime}`;
    const current = await redis.get(key);
    if (current === requestId) await redis.del(key);
  } catch (err) {
    // Ignore release error if Redis is down
  }
};
