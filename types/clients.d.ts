import type { ISendAsyncMessageConfig, ISendMessageConfig } from './messages';
import type { ESocketEvents } from '../src';
import type Websocket from 'ws';

export interface IBaseClient {
  disableEvent(event: ESocketEvents | string, action: (...params: unknown[]) => void | Promise<void>): void;

  disconnect(code?: number, data?: string | Buffer): void;

  sendMessage(message: unknown, options?: ISendMessageConfig): void;

  onMessage(action: (data: Websocket.RawData | string, isBinary: boolean) => void | Promise<void>): void;

  onError(action: (e: Error) => void | Promise<void>): void;

  onClose(action: (code: number, message: Buffer) => void | Promise<void>): void;

  readyState(): 0 | 1 | 2 | 3 | undefined;

  ping(data?: unknown, mask?: boolean, cb?: (err: Error) => void): void;

  sendAsyncMessage(message: unknown, options?: ISendAsyncMessageConfig): Promise<unknown>;
}

export interface IClient extends IBaseClient {
  /**
   * Get last x messages that client received
   */
  getLastMessages(amount = 1, remove = true): unknown[];

  /**
   * Create new client
   */
  connect(options: Websocket.ClientOptions = {}): Promise<void>;
}

export interface ISimpleClient extends IBaseClient {
  onOpen(action: () => void | Promise<void>): void;

  /**
   * Create new client
   */
  connect(): void;
}
