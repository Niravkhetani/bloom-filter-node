import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { connectRedis } from "./config/redis";
import feedRoutes from "./feed/feed.routes";

import { pg } from "./config/postgres";

const app = express();

app.use(express.json());

app.use(feedRoutes);

async function bootstrap() {
  await connectRedis();
  console.log("pg password", process.env.PG_PASSWORD);
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

bootstrap();
