import Websocket from 'ws';
import AbstractClient from './abstract';
import type { IClient } from '../../types';

export default class Client extends AbstractClient implements IClient {
  private _messages: unknown[] = [];

  private get messages(): unknown[] {
    return this._messages;
  }

  /**
   * Get last x messages that client received
   */
  getLastMessages(amount = 1, remove = true): unknown[] {
    const startIndex = Math.max(0, this.messages.length - amount);
    const messages = this.messages.slice(startIndex);

    if (remove) this.messages.splice(startIndex);
    return messages;
  }

  /**
   * Create new client
   */
  async connect(options: Websocket.ClientOptions = {}): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.client = new Websocket(`ws://localhost:${this.port}`, options);
      this.onOpen(() => {
        this.disableEvent('open', resolve as (...params: unknown[]) => void | Promise<void>);
        resolve();
      });
      this.onMessage((m) => {
        try {
          this.messages.push(JSON.parse(m.toString()));
        } catch (err) {
          this.messages.push(m.toString());
        }
      });
      this.onClose((_code, m) => {
        try {
          this.messages.push(JSON.parse(m.toString()));
        } catch (err) {
          this.messages.push(m.toString());
        }
      });
      this.onError((err) => {
        this.disableEvent('error', reject);
        reject(err);
      });
    });
  }

  private onOpen(action: (...params: unknown[]) => void | Promise<void>): void {
    this.client!.on('open', action);
  }
}
