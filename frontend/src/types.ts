/** Shared Home Assistant frontend types. */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

/** Subset of HA's FrontendLocaleData used for date display. */
export interface HassLocale {
  language: string;
  date_format?: "language" | "system" | "DMY" | "MDY" | "YMD";
  time_zone?: "local" | "server";
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  locale?: HassLocale;
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

declare global {
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
