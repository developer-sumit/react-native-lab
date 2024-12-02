import fs from "fs";

/**
 * A simple logger utility to log messages to a file.
 *
 * @example
 * ```
 * const projectName = "ReactNativeCLISetup";
 * const logger = new Logger("setup.log");
 * logger.log(`Starting project setup for ${projectName}`);
 *
 * logger.log("This is an info message");
 * logger.log("This is another message");
 *
 * // Don't forget to close the stream when done
 * logger.close();
 *```
 */
export default class Logger {
  private stream: fs.WriteStream;

  constructor(filePath: string) {
    this.stream = fs.createWriteStream(filePath, { flags: "a" });
  }

  log(message: string) {
    const timestamp = new Date().toISOString();
    this.stream.write(`${timestamp} - ${message}\n`);
  }

  close() {
    this.stream.end();
  }
}
