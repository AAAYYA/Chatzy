import type { Hono, MiddlewareHandler } from "hono";

export interface IServer {
    route: string;
    routeHandler(): Hono;
    middlewareHandler?(): Array<MiddlewareHandler>;
    wsHandler(): Hono;
}
