import fs from "fs";
import events from "events";
import { Request, Response, NextFunction } from "express";

export interface ILogEvent {
  time: Date;
  route: string;
  method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
  issuer: string;
  payload?: string;
}

const LOGS_FILENAME = "logs.txt";
export const REQUEST_EVENT = "request";
const writeStream = fs.createWriteStream(LOGS_FILENAME, { flags: "a" });
export const logEventEmitter = new events.EventEmitter();

logEventEmitter.on(REQUEST_EVENT, (event: ILogEvent) => {
  const logEntry = [
    `Accepted request at: ${event.time.toISOString()}`,
    ` - Method: ${event.method}`,
    ` - Route: ${event.route}`,
    ` - Issuer: ${event.issuer}`,
    event.payload ? ` - Payload: ${event.payload}` : "",
  ].join("\n");
  
  writeStream.write(logEntry + "\n\n");
});

export default function emitLogEventMiddleware(req: Request, res: Response, next: NextFunction) {
  const payload = req.body && typeof req.body === "object" ? JSON.stringify(req.body) : req.body;

  logEventEmitter.emit(REQUEST_EVENT, {
    time: new Date(),
    route: req.originalUrl,
    method: req.method as "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
    issuer: req.ip,
    payload,
  });

  next();
}
