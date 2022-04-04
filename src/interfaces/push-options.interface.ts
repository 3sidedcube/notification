export type IPushOptions =
    | { enabled: false }
    | {
          /**
           * Enable/disable Push (default `true`)
           */
          enabled?: true;
          /**
           * Use production environment. Set to `false` to use sandbox.
           * @default true
           */
          production?: boolean;
          /**
           * Reject Unauthorized property to be passed through
           * @default true
           */
          rejectUnauthorized?: boolean;
          /**
           * The maximum number of connection failures that will be tolerated
           * @default 3
           */
          connectionRetryLimit?: number;
          /**
           * maximum time in ms that apn will wait for a response to a request
           * @default 5000
           */
          requestTimeout?: number;
          /**
           * Apple Push Notification Service details
           */
          apns: {
              /**
               * Apple key with APNS enabled
               */
              key: string;
              /**
               * ID of the APNS key
               */
              keyID: string;
              /**
               * Team ID (must match key)
               */
              teamID: string;
              /**
               * App Bundle ID
               */
              topic: string;
          };
      };
