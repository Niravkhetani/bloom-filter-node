import { BloomService } from "../bloom/bloom.service";
import { pg } from "../config/postgres";

export class FeedService {
  static async markSeen(userId: number, postId: number) {
    //Create Bloom filter
    await BloomService.createBloomFilter(userId);

    // add to bloom
    await BloomService.addPost(userId, postId);

    //persist
    await pg.query(
      `
      INSERT INTO user_seen_posts(user_id, post_id)
      VALUES($1, $2)
      ON CONFLICT DO NOTHING
      `,
      [userId, postId],
    );
  }

  static async hasSeen(userId: number, postId: number) {
    const maybeSeen = await BloomService.maybeSeen(userId, postId);
    // console.log("maybeSeen", maybeSeen);
    if (!maybeSeen) {
      return false;
    }
    //verify from db
    const result = await pg.query(
      `
      SELECT * FROM user_seen_posts
      WHERE user_id = $1 AND post_id = $2
      `,
      [userId, postId],
    );
    return result && result.rowCount && result.rowCount > 0;
  }

  static async getFeed(userId: number) {
    const candidates = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110];
    const unseen: number[] = [];
    for (const postId of candidates) {
      const seen = await this.hasSeen(userId, postId);
      console.log("seen", seen, postId);
      if (!seen) {
        unseen.push(postId);
      }
    }
    return unseen;
  }
}
