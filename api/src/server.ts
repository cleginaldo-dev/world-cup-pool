import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import Fastify from "fastify";

import { authRoutes } from "./routes/auth.routes";
import { gameRoutes } from "./routes/game.routes";
import { guessRoutes } from "./routes/guess.routes";
import { pooRoutes } from "./routes/pool.routes";
import { userRoutes } from "./routes/user.routes";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: "8887eb6c7f19c3c883338cacc191b621",
  });

  await fastify.register(authRoutes);
  await fastify.register(pooRoutes);
  await fastify.register(userRoutes);
  await fastify.register(gameRoutes);
  await fastify.register(guessRoutes);

  await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

bootstrap();
