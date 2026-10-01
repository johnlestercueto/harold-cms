import type { AccountUser } from "@/lib/account";

type PayloadAuthResponse = {
  token?: string;
  user?: {
    email?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  doc?: {
    email?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  message?: string;
  errors?: Array<{ message?: string }>;
};

function getErrorMessage(result: PayloadAuthResponse, fallback: string) {
  return result.errors?.[0]?.message || result.message || fallback;
}

async function sendAuthRequest(
  path: "/api/auth/login" | "/api/auth/register",
  body: Record<string, string>,
  fallback: string,
) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = (await response.json()) as PayloadAuthResponse;

  const account = result.user || result.doc;

  if (!response.ok || !account?.email) {
    throw new Error(getErrorMessage(result, fallback));
  }

  const user: AccountUser = {
    email: account.email,
    name:
      account.name ||
      [account.firstName, account.lastName].filter(Boolean).join(" ") ||
      account.email,
    phone: account.phone,
    token: result.token,
  };

  return user;
}

export function registerAccount(
  name: string,
  phone: string,
  email: string,
  password: string,
) {
  const [firstName, ...lastNameParts] = name.split(/\s+/);

  return sendAuthRequest(
    "/api/auth/register",
    {
      firstName,
      lastName: lastNameParts.join(" ") || firstName,
      phone,
      email,
      password,
    },
    "Unable to create your account.",
  );
}

export function loginAccount(email: string, password: string) {
  return sendAuthRequest(
    "/api/auth/login",
    { email, password },
    "Unable to log in with those details.",
  );
}
