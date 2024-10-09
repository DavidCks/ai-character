import { LlamaClient } from "../worker/llama-client";
import { Message } from "../worker/llama-worker";

export class LlamaManager {
  private _client: LlamaClient;
  private _initPromise: Promise<void> | true;

  constructor() {
    this._client = new LlamaClient("/llama-worker.js", true);
    this._initPromise = this._client.initialize();
  }

  public async generateResponse(
    messages: Message[],
    maxTokens: number
  ): Promise<string> {
    if (this._initPromise !== true) {
      await this._initPromise;
      this._initPromise = true;
    }
    return this._client.generateResponse(messages, maxTokens);
  }
}
