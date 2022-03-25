export type ISMSOptions =
    | { enabled: false }
    | {
          /**
           * Enable/disable SMS (default `true`)
           */
          enabled?: true;
          /**
           * AWS SNS Access Details
           */
          aws: {
              /**
               * AWS Region
               */
              region: string;
              /**
               * AWS Access key ID with SNS IAM privileges
               */
              accessKeyId: string;
              /**
               * Corresponding AWS secret key
               */
              secretAccessKey: string;
          };
          /**
           * SMS sender ID
           */
          sender?: string;

          /**
           * The type of message that you are sending:
           *  - Transactional (default) – Critical messages that support customer transactions, such as one-time passcodes for multi-factor authentication.
           *  - Promotional – Noncritical messages, such as marketing messages.
           */
          messageType?: 'Transactional' | 'Promotional';
      };
