/**
 * Production-safe logger.
 * In __DEV__ mode logs to console; in production sends to Sentry.
 * NEVER logs tokens, passwords, or PII.
 */
import * as Sentry from "@sentry/react-native";

type LogLevel = "debug" | "info" | "warn" | "error";

const SENSITIVE_KEYS = [
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "secret",
  "authorization",
];

function sanitize(data: unknown): unknown {
  if (typeof data !== "object" || data === null) return data;

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.some((sk) => key.toLowerCase().includes(sk))) {
      sanitized[key] = "[REDACTED]";
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function log(level: LogLevel, message: string, data?: unknown) {
  const safe = data ? sanitize(data) : undefined;

  if (__DEV__) {
    const fn = level === "debug" ? "log" : level;
    // eslint-disable-next-line no-console
    console[fn](`[${level.toUpperCase()}] ${message}`, safe ?? "");
    return;
  }

  // Production: breadcrumb + error capture
  Sentry.addBreadcrumb({
    category: "app",
    message,
    level: level as Sentry.SeverityLevel,
    data: safe as Record<string, unknown> | undefined,
  });

  if (level === "error") {
    Sentry.captureMessage(message, "error");
  }
}

export const logger = {
  debug: (msg: string, data?: unknown) => log("debug", msg, data),
  info: (msg: string, data?: unknown) => log("info", msg, data),
  warn: (msg: string, data?: unknown) => log("warn", msg, data),
  error: (msg: string, data?: unknown) => log("error", msg, data),
};
