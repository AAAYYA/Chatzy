import { redis } from "../modules/utils/redis";

export async function pushToUser(userId: number, payload: unknown) {
  await redis.publish(
    "nubbly:messages",
    JSON.stringify({ toUserId: userId, ...payload })
  );
}
