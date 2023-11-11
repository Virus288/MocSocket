import Websocket from 'ws';
import AbstractClient from './abstract';
import type { ISimpleClient } from '../../types';

export default class SimpleClient extends AbstractClient implements ISimpleClient {
  onOpen(action: (...params: unknown[]) => void | Promise<void>): void {
    !this.client ? console.log('Client not open') : this.client.on('open', action);
  }

  /**
   * Create new client
   */
  connect(options: Websocket.ClientOptions = {}): void {
    this.client = new Websocket(`ws://localhost:${this.port}`, options);
  }
}
