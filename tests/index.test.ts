import { describe, expect, it } from '@jest/globals';
import Websocket from 'ws';
import MocSocket, { type IClient } from '../src';
import { ClientNotOpen, NoServer } from '../src/errors';

describe('Tests', () => {
  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing server`, async () => {
        let mock: MocSocket | undefined;

        try {
          // @ts-ignore
          mock = new MocSocket();
        } catch (err) {
          expect((err as Error).message).toEqual(new NoServer().message);
        }

        expect(mock).toEqual(undefined);
      });

      it(`Client not open`, async () => {
        let error: Error = new Error();

        const server = new Websocket.Server({
          noServer: true,
        });
        const mock = new MocSocket(server);
        const client = mock.createClient();

        try {
          client.sendMessage('test');
        } catch (err) {
          error = err as Error;
        }

        expect(error.message).toEqual(new ClientNotOpen().message);
        mock.close();
      });
    });
  });

  describe('Should pass', () => {
    let server: Websocket.Server;
    let mock: MocSocket;
    let client: IClient;

    beforeEach(() => {
      server = new Websocket.Server({
        noServer: true,
      });
      mock = new MocSocket(server);
      client = mock.createClient();
    });

    afterEach(() => {
      mock.close();
    });

    it(`Connect, send message and receive 1 back`, async () => {
      server.on('connection', (ws) => {
        ws.on('message', () => ws.send(JSON.stringify({ userId: 1 })));
      });

      await client.connect();
      const callback = await client.sendAsyncMessage('Test');

      expect(callback).toEqual({ userId: 1 });
    });
  });
});
