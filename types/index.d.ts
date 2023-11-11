import type { EventEmitter } from 'events';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';
import type Websocket from 'ws';

export interface IWebsocketServer extends EventEmitter {
  handleUpgrade(
    request: IncomingMessage,
    socket: Duplex,
    upgradeHead: Buffer,
    callback: (client: unknown, request: IncomingMessage) => void,
  ): void;
}

export interface ISocketClient {
  disconnect(code?: number, data?: string | Buffer): void;

  onOpen(action: () => void | Promise<void>): void;

  onMessage(action: (data: Websocket.RawData, isBinary: boolean) => void | Promise<void>): void;

  onError(action: (e: Error) => void | Promise<void>): void;

  onClose(action: (code: number, message: Buffer) => void | Promise<void>): void;

  sendMessage(message: unknown): void;

  connect(): Promise<void>;

  simpleConnect(): void;
}
