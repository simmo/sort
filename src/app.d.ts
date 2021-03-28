interface Window {
  /** Google Global Site Tag */
  gtag?: (
    command: 'event',
    action: string,
    params: {
      event_category: string;
      event_label: string;
      value?: number;
    }
  ) => void;
}

/** Development mode */
declare var DEV: boolean;
