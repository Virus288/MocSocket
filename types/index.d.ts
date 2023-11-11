import type { EventEmitter } from 'events';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';

export interface IWebsocketServer extends EventEmitter {
  handleUpgrade(
    request: IncomingMessage,
    socket: Duplex,
    upgradeHead: Buffer,
    callback: (client: unknown, request: IncomingMessage) => void,
  ): void;
}

export * from './clients';
export * from './messages';
