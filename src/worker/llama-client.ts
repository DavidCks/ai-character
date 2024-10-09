import { Message, LlamaWorker } from "./llama-worker";

export class LlamaClient {
  private _worker: Worker | undefined;
  private _syncWorker: LlamaWorker | undefined;

  constructor(workerPath: string = "./llama-worker.js", sync: boolean = false) {
    if (sync) {
      this._syncWorker = new LlamaWorker();
    } else {
      this._worker = new Worker(workerPath, { type: "module" });
    }
  }

  // Initialize the LlamaWorker by sending a message to the worker
  public initialize(): Promise<void> {
    if (this._syncWorker) {
      return this._syncWorker.initialize();
    }
    return new Promise((resolve, reject) => {
      this._worker!.onmessage = (event: MessageEvent) => {
        const { type, data } = event.data;

        if (type === "response" && data === "Initialized") {
          resolve(); // Resolve the promise when the model is initialized
        } else if (type === "error") {
          reject(new Error(data)); // Reject the promise if there's an error
        }
      };

      // Send the message to the worker to initialize the model
      this._worker!.postMessage({ type: "initialize" });
    });
  }

  // Generate a response by sending a request to the worker
  public generateResponse(
    messages: Message[],
    maxTokens: number = 128
  ): Promise<string> {
    if (this._syncWorker) {
      return this._syncWorker.generateResponse(messages, maxTokens);
    }
    return new Promise((resolve, reject) => {
      this._worker!.onmessage = (event: MessageEvent) => {
        const { type, data } = event.data;

        if (type === "response") {
          resolve(data);
        } else if (type === "error") {
          reject(new Error(data));
        }
      };

      // Send the message to the worker to generate a response
      this._worker!.postMessage({
        type: "generate",
        payload: { messages, maxTokens },
      });
    });
  }

  // Terminate the worker once you're done
  public terminate(): void {
    if (this._worker) {
      this._worker.terminate();
    }
  }
}
