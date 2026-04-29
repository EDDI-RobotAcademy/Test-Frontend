type ClientEnvKey = "NEXT_PUBLIC_API_BASE_URL";
type ServerEnvKey = never;

const REQUIRED_CLIENT_KEYS: readonly ClientEnvKey[] = [
  "NEXT_PUBLIC_API_BASE_URL",
] as const;

const REQUIRED_SERVER_KEYS: readonly ServerEnvKey[] = [] as const;

const CLIENT_ENV_SOURCE: Record<ClientEnvKey, string | undefined> = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
};

function readRequired<K extends string>(
  source: Record<K, string | undefined>,
  keys: readonly K[],
): Record<K, string> {
  const missing: K[] = [];
  const resolved = {} as Record<K, string>;

  for (const key of keys) {
    const value = source[key];
    if (value === undefined || value === "") {
      missing.push(key);
      continue;
    }
    resolved[key] = value;
  }

  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  return resolved;
}

const clientEnv = readRequired(CLIENT_ENV_SOURCE, REQUIRED_CLIENT_KEYS);

const serverEnv =
  typeof window === "undefined"
    ? readRequired(
        {} as Record<ServerEnvKey, string | undefined>,
        REQUIRED_SERVER_KEYS,
      )
    : ({} as Record<ServerEnvKey, string>);

export const env = {
  client: {
    apiBaseUrl: clientEnv.NEXT_PUBLIC_API_BASE_URL,
  },
  server: serverEnv,
} as const;
