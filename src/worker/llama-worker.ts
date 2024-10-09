import { pipeline, TextGenerationPipeline } from "@huggingface/transformers";

// Define the Message interface again for use in the worker
export interface Message {
  role: "system" | "user";
  content: string;
}

export class LlamaWorker {
  private generator: TextGenerationPipeline | null = null;

  constructor() {
    self.onmessage = this.handleMessage.bind(this);
  }

  // Message handler for different tasks
  private async handleMessage(event: MessageEvent) {
    const { type, payload } = event.data;

    switch (type) {
      case "initialize":
        await this.initialize();
        break;

      case "generate":
        const { messages, maxTokens } = payload;
        try {
          const response = await this.generateResponse(messages, maxTokens);
          self.postMessage({ type: "response", data: response });
        } catch (error: any) {
          self.postMessage({ type: "error", data: error.message });
        }
        break;

      default:
        self.postMessage({ type: "error", data: "Unknown message type" });
    }
  }

  public async initialize(): Promise<void> {
    try {
      this.generator = await pipeline(
        "text-generation",
        "onnx-community/Llama-3.2-1B-Instruct",
        {
          progress_callback: (progressData: any) => {
            console.log("Progress:", progressData);
            self.postMessage({
              type: "progress",
              data: progressData,
            });
          },
        }
      );
      console.log("Llama Initialized");
      self.postMessage({ type: "response", data: "Initialized" });
    } catch (error: any) {
      console.error("Llama failed to initialize:", error);
      self.postMessage({
        type: "error",
        data: "Failed to initialize: " + error.message,
      });
    }
  }

  // Generate a response using the generator
  public async generateResponse(
    messages: Message[],
    maxTokens: number
  ): Promise<string> {
    if (!this.generator) {
      console.error("Llama generator not initialized");
    }

    const output = await this.generator!(messages, {
      max_new_tokens: maxTokens,
    });
    return (output[0] as any).generated_text.at(-1).content;
  }
}

// Instantiate the worker
new LlamaWorker();
