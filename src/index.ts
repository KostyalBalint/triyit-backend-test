import { config } from "./config";
import { createApp } from "./app";
import { logger } from "./utils/logger.js";

async function startServer() {
  try {
    logger.info("Starting server...");
    const { app } = await createApp();

    const server = app.listen(config.port, () => {
      logger.info(
        `Server listening on: http://localhost:${config.port}${config.gqlPath}`,
      );
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received, shutting down gracefully");
      server.close();
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT received, shutting down gracefully");
      server.close();
    });
  } catch (error) {
    logger.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
