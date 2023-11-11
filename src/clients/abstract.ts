import type { IBaseClient } from '../../types';
import type { ESocketEvents } from '../enums';
import type WebSocket from 'ws';

export default abstract class AbstractClient implements IBaseClient {
  protected readonly _port: number;
  private _client: WebSocket | undefined;

  constructor(port: number) {
    this._port = port;
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

  readyState(): 0 | 1 | 2 | 3 | undefined {
    return this._client?.readyState;
  }

  disableEvent(event: ESocketEvents | string, action: (...params: unknown[]) => void | Promise<void>): void {
    !this.client ? console.log('Client not open') : this.client.off(event, action);
  }

  disconnect(code?: number, data?: string | Buffer): void {
    !this.client ? console.log('Client not open') : this.client.close(code, data);
  }

  sendMessage(message: unknown, options?: { delayed?: number }): void {
    if (options?.delayed) {
      setTimeout(() => {
        !this.client ? console.log('Client not open') : this.client.send(JSON.stringify(message));
      }, options.delayed);
    }
  }

  onMessage(action: (data: WebSocket.RawData | string, isBinary: boolean) => void | Promise<void>): void {
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
}
