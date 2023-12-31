import { ESocketEvents } from '../enums';
import { ClientNotOpen } from '../errors';
import type { IBaseClient, ISendAsyncMessageConfig, ISendMessageConfig } from '../../types';
import type WebSocket from 'ws';

export default abstract class AbstractClient implements IBaseClient {
  protected readonly _port: number;
  private _client: WebSocket | undefined;

  constructor(port: number) {
    this._port = port;
    return new Proxy(this, this.createHandler());
  }

  protected get port(): number {
    return this._port;
  }

  protected get client(): WebSocket | undefined {
    return this._client;
  }

  protected set client(value: WebSocket | undefined) {
    this._client = value;
  }

  disableEvent(event: ESocketEvents | string, action: (...params: unknown[]) => void | Promise<void>): void {
    this.client!.off(event, action);
  }

  disconnect(code?: number, data?: string | Buffer): void {
    this.client!.close(code, data);
  }

  sendMessage(message: unknown, options?: ISendMessageConfig): void {
    if (options?.delayed) {
      setTimeout(() => {
        this.client!.send(JSON.stringify(message));
      }, options.delayed);
    }
    this.client!.send(JSON.stringify(message));
  }

  onMessage(action: (message: WebSocket.RawData | string, isBinary: boolean) => void | Promise<void>): void {
    this.client!.on(ESocketEvents.Message, (message, isBinary) => action(message, isBinary));
  }

  onError(action: (e: Error) => void | Promise<void>): void {
    this.client!.on(ESocketEvents.Error, (e) => action(e));
  }

  onClose(action: (code: number, message: Buffer) => void | Promise<void>): void {
    this.client!.on(ESocketEvents.Close, (code, message) => action(code, message));
  }

  readyState(): 0 | 1 | 2 | 3 | undefined {
    return this._client?.readyState;
  }

  ping(data?: unknown, mask?: boolean, action?: (e: Error) => void): void {
    this.client!.ping(data, mask, action);
  }

  /**
   * Create new client
   */
  async sendAsyncMessage(message: unknown, options?: ISendAsyncMessageConfig): Promise<unknown> {
    return new Promise((resolve) => {
      const delayed: NodeJS.Timeout | undefined = undefined;

      const timeout = setTimeout(() => {
        if (delayed) clearTimeout(delayed);
        return resolve(undefined);
      }, (options?.timeout ?? 2000) + (options?.delayed ?? 0));

      if (options?.delayed) {
        setTimeout(() => {
          this.client!.send(JSON.stringify(message));
        }, options.delayed);
      }
      this.client!.send(JSON.stringify(message));

      this.client!.once(ESocketEvents.Message, (m: WebSocket.RawData | string) => {
        try {
          clearTimeout(timeout);
          resolve(JSON.parse(m as string));
        } catch (err) {
          clearTimeout(timeout);
          resolve(m as string);
        }
      });
    });
  }

  close(): void {
    this.client?.close();
  }

  private createHandler(): ProxyHandler<this> {
    return {
      get: (target: this, prop: string, receiver): (() => void) => {
        const value = target[prop as keyof this];

        if (value instanceof Function) {
          const allowedActions = ['connect', 'close'];
          if (!allowedActions.includes(prop)) {
            if (!this.client) throw new ClientNotOpen();
          }

          return (...args) => {
            return value.apply(this === receiver ? target : this, args) as unknown;
          };
        }
        return value as () => void;
      },
    };
  }
}
