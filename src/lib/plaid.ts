import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

function getEnv(name: string): string | undefined {
  return process.env[name];
}

export function getPlaidClient(): PlaidApi {
  const clientId = getEnv("PLAID_CLIENT_ID");
  const secret = getEnv("PLAID_SECRET");
  const envName = (getEnv("PLAID_ENV") || "sandbox").toLowerCase();

  if (!clientId || !secret) {
    throw new Error("Missing PLAID_CLIENT_ID or PLAID_SECRET environment variables");
  }

  const environment =
    envName === "production"
      ? PlaidEnvironments.production
      : envName === "development"
      ? PlaidEnvironments.development
      : PlaidEnvironments.sandbox;

  const configuration = new Configuration({
    basePath: environment,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": clientId,
        "PLAID-SECRET": secret,
      },
    },
  });

  return new PlaidApi(configuration);
}

export function getPlaidDefaults() {
  const products = (getEnv("PLAID_PRODUCTS") || "transactions").split(",").map((p) => p.trim());
  const countryCodes = (getEnv("PLAID_COUNTRY_CODES") || "US,CA,GB,IE,FR,ES,NL,SE,NO,DK").split(",").map((c) => c.trim());
  const redirectUri = getEnv("PLAID_REDIRECT_URI");
  return { products, countryCodes, redirectUri };
}

