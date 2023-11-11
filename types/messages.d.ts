export interface ISendMessageConfig {
  delayed?: number;
}

export interface ISendAsyncMessageConfig extends ISendMessageConfig {
  delayed?: number;
  timeout?: number;
}
