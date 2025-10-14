import pino from "pino";

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
  level: "trace",
});

export type Logger = typeof logger;

export const customLogger = (message: string, ...rest: string[]) => {
  logger.info(`${message} ${rest.join(" ")}`);
};
