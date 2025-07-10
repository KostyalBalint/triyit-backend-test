import { config } from "./config";
import { createApp, closeApp } from "./app";
import { logger } from "./utils/logger.js";

async function startServer() {
  let appInstance;
  try {
    logger.info("Starting server...");
    appInstance = await createApp();
    const { app } = appInstance;

    const server = app.listen(config.port, () => {
      logger.info(
        `Server listening on: http://localhost:${config.port}${config.gqlPath}`,
      );
    }).on('error', (error) => {
      logger.error("Server failed to start:", error);
      process.exit(1);
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully`);
      server.close(async () => {
        if (appInstance) {
          try {
            await closeApp(appInstance);
            process.exit(0);
          } catch (error) {
            logger.error("Error during graceful shutdown:", error);
            process.exit(1);
          }
        }
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  } catch (error) {
    logger.error("Error starting server:", error);
    if (appInstance) {
      try {
        await closeApp(appInstance);
      } catch (closeError) {
        logger.error("Error during cleanup:", closeError);
      }
    }
    process.exit(1);
  }
}

startServer();
