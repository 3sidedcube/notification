export type IEmailOptions =
    | { enabled: false }
    | {
          /**
           * Enable/disable emails (default `true`)
           */
          enabled?: true;
          /**
           * SMTP Host
           */
          host: string;
          /**
           * SMTP Port
           */
          port: number;
          /**
           * SMTP User
           */
          user: string;
          /**
           * SMTP Password
           */
          password: string;
          /**
           * Default from value
           */
          from: string;
      };
