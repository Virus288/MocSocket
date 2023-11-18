// eslint-disable-next-line max-classes-per-file
export class NoServer extends Error {
  constructor() {
    super('NoServer');
    this.message = 'No server provided';
  }
}

export class ClientNotOpen extends Error {
  constructor() {
    super('ClientNotOpen');
    this.message = 'Client is not open';
  }
}
