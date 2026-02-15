/**
 * Sentry initialization — run once at app startup.
 * DSN is injected via EAS Secrets → app.config.ts → Constants.
 * @see https://docs.sentry.io/platforms/react-native/
 */
import * as Sentry from "@sentry/react-native";
import { config } from "@shared/config";

export function initSentry(): void {
  if (!config.sentryDsn) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[Sentry] No DSN configured, skipping init");
    }
    return;
  }

  Sentry.init({
    dsn: config.sentryDsn,
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    debug: __DEV__,
    environment: __DEV__ ? "development" : "production",
    beforeSend(event) {
      // Strip sensitive data from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((bc) => {
          if (bc.data && typeof bc.data === "object") {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { authorization, token, ...safe } = bc.data as Record<string, unknown>;
            bc.data = safe;
          }
          return bc;
        });
      }
      return event;
    },
  });
}
