import fs from "fs";
import path from "path";

const logFilePath = path.join(process.cwd(), "logs.txt");

export const logger = (message) => {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error("Error escribiendo el log:", err);
  });
};
