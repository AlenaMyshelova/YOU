/**
 * API layer barrel export.
 *
 * TODO: Replace manual type definitions with auto-generated types from OpenAPI spec.
 *
 * To generate types from a running FastAPI backend:
 *   1. npm install -D openapi-typescript
 *   2. npx openapi-typescript http://localhost:8000/openapi.json -o src/api/types.generated.ts
 *   3. Update imports in feature modules to use generated types
 *
 * The current manual types in src/shared/types/ mirror the expected OpenAPI schema:
 *   - User, AuthTokens, LoginRequest, RegisterRequest, AuthResponse
 *   - Post, CreatePostRequest, PaginatedResponse
 *   - AppNotification, SearchResult
 *   - WSMessage, WSEventType
 */
export * from "../shared/types";
export { apiClient } from "../shared/lib/apiClient";
