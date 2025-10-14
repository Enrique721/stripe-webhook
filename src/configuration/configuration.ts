export type databaseConfig = {
  url: string;
  pass?: string;
  user?: string;
};

export type webhookSecret = {
  secret: string;
}


type EnviromentProps = {
  databases: {
    dash: databaseConfig;
  };
  webhook: webhookSecret;
  stripe: {
    privateKey: string;
  }
};

export default (): EnviromentProps => ({
    databases: {
        dash: {
            url: process.env.URL_DASH_DB || "",
            pass: process.env.PASS_DASH_DB,
            user: process.env.USER_DASH_DB,
        },
    },
    webhook: {
      secret: process.env.WEBHOOK_SECRET || ""
    },
    stripe: {
      privateKey: process.env.STRIPE_PRIVATE_KEY || ""
    }
});