/** Shared Home Assistant frontend types. */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ) => Promise<unknown>;
  connection: {
    sendMessagePromise: <T = unknown>(message: Record<string, unknown>) => Promise<T>;
    subscribeMessage: <T>(
      callback: (message: T) => void,
      subscribeMessage: Record<string, unknown>,
    ) => Promise<() => void>;
  };
  localize: (key: string) => string;
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }

  interface BarcodeDetector {
    detect(source: ImageBitmapSource): Promise<Array<{ rawValue: string }>>;
  }

  // eslint-disable-next-line no-var
  var BarcodeDetector: {
    new (options?: { formats?: string[] }): BarcodeDetector;
    getSupportedFormats(): Promise<string[]>;
  };
}

export {};
