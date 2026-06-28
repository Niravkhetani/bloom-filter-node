import { Request, Response, Router } from "express";
import { FeedService } from "./feed.service";

const router = Router();

router.post("/seen", async (req: Request, res: Response) => {
  const { userId, postId } = req.body;
  await FeedService.markSeen(userId, postId);
  res.status(200).json({
    message: "Post marked as seen",
  });
});

router.get("/feed/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  const result = await FeedService.getFeed(userId);
  res.status(200).json(result);
});

router.get("/debug/:userId/:postId", async (req, res) => {
  const userId = Number(req.params.userId);
  const postId = Number(req.params.postId);
  const result = await FeedService.hasSeen(userId, postId);
  res.status(200).json(result);
});

export default router;
