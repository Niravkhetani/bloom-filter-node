import { redis } from "../config/redis";

export class BloomService {
  static getKey(userId: number) {
    return `bf:user:${userId}`;
  }

  static async createBloomFilter(userId: number) {
    const key = this.getKey(userId);
    const exists = await redis.exists(key);
    if (!exists) {
      await redis
        .sendCommand(["BF.RESERVE", key, "0.01", "100000"])
        .catch((err) => {
          console.log("error creating bloom filter", err);
        });
    }
  }

  static async addPost(userId: number, postId: number) {
    const key = this.getKey(userId);

    await redis.sendCommand(["BF.ADD", key, postId.toString()]).catch((err) => {
      console.log("error adding post", err);
    });
  }

  static async maybeSeen(userId: number, postId: number) {
    const key = this.getKey(userId);
    try {
      const result: number = await redis.sendCommand([
        "BF.EXISTS",
        key,
        postId.toString(),
      ]);
      return result === 1;
    } catch (e) {
      console.log(e);
    }
  }
}
