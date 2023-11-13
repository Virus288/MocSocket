import Client from './clients/client';
import SimpleClient from './clients/simpleClient';
import { NoServer } from './errors';
import type { IClient, ISimpleClient, IWebsocketServer } from '../types';
import type { AddressInfo } from 'ws';
import http from 'http';

export default class MocSocket {
  private readonly _wsServer: IWebsocketServer;
  private _server: http.Server | null = null;
  private _clients: (IClient | ISimpleClient)[] = [];

  constructor(socketServer: IWebsocketServer) {
    if (!socketServer) throw new NoServer();
    this._wsServer = socketServer;
    this.init();
  }

  private get clients(): (IClient | ISimpleClient)[] {
    return this._clients;
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
  createSimpleClient(): ISimpleClient {
    const client = new SimpleClient((this.server.address() as AddressInfo).port);
    this.clients.push(client);
    return client;
  }

  /**
   * Create new client
   */
  createClient(): IClient {
    const client = new Client((this.server.address() as AddressInfo).port);
    this.clients.push(client);
    return client;
  }

  /**
   * Create connection
   */
  close(): void {
    this.server.close();
    this.wsServer.close();
    this.clients.forEach((c) => c.close());
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
