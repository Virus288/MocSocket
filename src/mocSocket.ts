import SocketClient from './client';
import type { ISocketClient, IWebsocketServer } from '../types';
import type { AddressInfo } from 'ws';
import http from 'http';

export default class MocSocket {
  private readonly _wsServer: IWebsocketServer;
  private _server: http.Server | null = null;

  constructor(socketServer: IWebsocketServer) {
    this._wsServer = socketServer;
    this.init();
  }

  private get server(): http.Server {
    return this._server!;
  }

  private get wsServer(): IWebsocketServer {
    return this._wsServer;
  }

  /**
   * Create new client
   */
  createClient(): ISocketClient {
    return new SocketClient((this.server.address() as AddressInfo).port);
  }

  /**
   * Create connection
   */
  close(): void {
    this.server.close();
  }

  /**
   * Initialize app
   */
  private init(): void {
    this._server = http.createServer();
    this.server.listen(0);

    this.server.on('upgrade', (request, socket, head) => {
      this.wsServer.handleUpgrade(request, socket, head, (ws) => {
        this.wsServer.emit('connection', ws, request);
      });
    });
  }
}
