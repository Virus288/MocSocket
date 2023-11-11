import Websocket from 'ws';
import type { ESocketEvents } from './enums';
import type { ISocketClient } from '../types';

export default class Client implements ISocketClient {
  private _client: Websocket | undefined;
  private readonly _port: number;

  constructor(port: number) {
    this._port = port;
  }

  private get port(): number {
    return this._port;
  }

  private get client(): Websocket | undefined {
    return this._client;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disableEvent(event: ESocketEvents | string, action: (...params: any[]) => void | Promise<void>): void {
    !this.client ? console.log('Client not open') : this.client.off(event, action);
  }

  disconnect(code?: number, data?: string | Buffer): void {
    !this.client ? console.log('Client not open') : this.client.close(code, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOpen(action: (...params: any[]) => void | Promise<void>): void {
    !this.client ? console.log('Client not open') : this.client.on('open', action);
  }

  onMessage(action: (data: Websocket.RawData, isBinary: boolean) => void | Promise<void>): void {
    !this.client
      ? console.log('Client not open')
      : this.client.on('message', (data, isBinary) => action(data, isBinary));
  }

  onError(action: (e: Error) => void | Promise<void>): void {
    !this.client ? console.log('Client not open') : this.client.on('error', (e) => action(e));
  }

  onClose(action: (code: number, message: Buffer) => void | Promise<void>): void {
    !this.client ? console.log('Client not open') : this.client.on('close', (code, message) => action(code, message));
  }

  sendMessage(message: unknown): void {
    !this.client ? console.log('Client not open') : this.client.send(JSON.stringify(message));
  }

  /**
   * Create new client and trigger event listeners for messages/events
   */
  async connect(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this._client = new Websocket(`ws://localhost:${this.port}`);
      this.onOpen(() => {
        this.disableEvent('open', resolve);
        resolve();
      });
      this.onError((err) => {
        this.disableEvent('error', reject);
        reject(err);
      });
    });
  }

  /**
   * Create new client without triggering any event listeners
   */
  simpleConnect(): void {
    this._client = new Websocket(`ws://localhost:${this.port}`);
  }
}
