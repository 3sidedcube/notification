export type ICustomOptions =
    | { enabled: false }
    | {
          /**
           * Enable/disable custom notifications (default `false`)
           */
          enabled?: true;
      };
