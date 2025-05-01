import type { Hono, MiddlewareHandler } from "hono";

/**
 * Abstract base class for all server modules.
 * Implements shared logic and enforces contract via IServer.
 */
export abstract class AServer {
    route: string;

    /**
     * Constructor for the AServer class.
     * @param route - The base route for this service.
     */
    constructor(route: string) {
        this.route = route;
    }
    
    /**
     * Abstract method to be implemented by subclasses for handling routes.
     * @returns {Hono} - The Hono instance for this route.
     */
    abstract routeHandler(): Hono
    /**
     * Abstract method to be implemented by subclasses for handling middleware.
     * @returns {Array<MiddlewareHandler>} - An array of middleware handlers.
     */
    abstract middlewareHandler?(): Array<MiddlewareHandler>

    /**
     * Abstract method to be implemented by subclasses for handling WebSocket connections.
     * @returns {Hono} - The Hono instance for WebSocket connections.
     */
    abstract wsHandler(): Hono
    /**
     * Abstract method to be implemented by subclasses for handling WebSocket connections.
     * @returns {Hono} - The Hono instance for WebSocket connections.
     */
    getRoute(): string {
        return this.route;
    }
    /**
     * Abstract method to be implemented by subclasses for handling WebSocket connections.
     * @returns {Hono} - The Hono instance for WebSocket connections.
     */
    setRoute(route: string): void {
        this.route = route;
    }
}
