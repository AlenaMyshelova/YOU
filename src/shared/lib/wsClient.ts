/**
 * WebSocket client with:
 * - Auto-reconnect with exponential backoff
 * - Heartbeat/ping to detect stale connections
 * - Auth token injection
 * - Event-based message routing
 * - TanStack Query cache integration (invalidate/patch)
 *
 * @see RFC 6455
 */
import { config } from "@shared/config";
import { tokenStorage } from "./tokenStorage";
import { queryClient } from "./queryClient";
import { logger } from "./logger";
import type { WSMessage, WSEventType } from "@shared/types";

type WSListener = (message: WSMessage) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private listeners = new Map<WSEventType, Set<WSListener>>();
  private reconnectAttempt = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatInterval = 30_000; // 30s
  private isIntentionallyClosed = false;

  async connect(): Promise<void> {
    // Skip real WS connection in dev mode (using mock API)
    if (__DEV__ && typeof jest === "undefined") {
      logger.debug("WS: Skipped in dev mock mode");
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) return;

    const token = await tokenStorage.getAccessToken();
    if (!token) {
      logger.warn("WS: No token, skipping connection");
      return;
    }

    this.isIntentionallyClosed = false;

    try {
      // Pass token as query param (common pattern for WS auth)
      // Alternative: send auth message after connection
      this.ws = new WebSocket(`${config.wsBaseUrl}?token=${token}`);

      this.ws.onopen = () => {
        logger.info("WS: Connected");
        this.reconnectAttempt = 0;
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data as string) as WSMessage;
          this.handleMessage(message);
        } catch (err) {
          logger.error("WS: Failed to parse message", err);
        }
      };

      this.ws.onclose = (event) => {
        logger.info("WS: Closed", { code: event.code, reason: event.reason });
        this.stopHeartbeat();
        if (!this.isIntentionallyClosed) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        logger.error("WS: Error", error);
      };
    } catch (err) {
      logger.error("WS: Connection failed", err);
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }
  }

  on(event: WSEventType, listener: WSListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  send(data: unknown): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      logger.warn("WS: Cannot send, not connected");
      return;
    }
    this.ws.send(JSON.stringify(data));
  }

  // ─── Private ───────────────────────────────────────────
  private handleMessage(message: WSMessage): void {
    // Notify type-specific listeners
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach((fn) => fn(message));
    }

    // Integrate with TanStack Query cache
    switch (message.type) {
      case "notification":
        // Invalidate notifications query to refetch
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        break;
      case "chat_message":
        queryClient.invalidateQueries({ queryKey: ["chat"] });
        break;
      default:
        break;
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempt >= this.maxReconnectAttempts) {
      logger.error("WS: Max reconnect attempts reached");
      return;
    }

    // Exponential backoff: 1s, 2s, 4s, 8s ... capped at 30s
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempt), 30_000);
    this.reconnectAttempt++;

    logger.info(`WS: Reconnecting in ${delay}ms (attempt ${this.reconnectAttempt})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }
}

export const wsClient = new WebSocketClient();
