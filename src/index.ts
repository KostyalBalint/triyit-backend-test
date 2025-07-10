import { config } from "./config";
import { createApp } from "./app";

async function startServer() {
  try {
    const { app } = await createApp();

    const server = app.listen(config.port, () => {
      console.log(
        `Listening on: http://localhost:${config.port}${config.gqlPath}`,
      );
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close();
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully");
      server.close();
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
