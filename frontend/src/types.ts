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

/** Companion external bus (subset used for barcode scanning). */
export interface HassExternalBus {
  config: {
    hasBarCodeScanner?: number;
  };
  fireMessage: (msg: Record<string, unknown>) => void;
  receiveMessage: (msg: unknown) => void;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  locale?: HassLocale;
  themes?: {
    darkMode?: boolean;
  };
  user?: {
    id?: string;
    name?: string;
    is_admin?: boolean;
  };
  auth?: {
    external?: HassExternalBus;
  };
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

export {};
