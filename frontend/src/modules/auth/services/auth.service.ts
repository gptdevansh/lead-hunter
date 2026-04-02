import type { SignInFormValues, SignUpFormValues } from "@/modules/auth/types/auth";

type AuthApiResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
const GOOGLE_AUTH_URL =
  process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL ?? `${API_BASE_URL}/auth/google`;

async function requestAuth(path: string, body: Record<string, string>): Promise<AuthApiResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(errorPayload?.detail ?? "Authentication request failed");
  }

  return (await response.json()) as AuthApiResponse;
}

export async function signIn(values: SignInFormValues): Promise<AuthApiResponse> {
  return requestAuth("/auth/signin", {
    email: values.email,
    password: values.password,
  });
}

export async function signUp(values: SignUpFormValues): Promise<AuthApiResponse> {
  return requestAuth("/auth/signup", {
    first_name: values.firstName,
    last_name: values.lastName,
    email: values.email,
    password: values.password,
  });
}

export function continueWithGoogle(mode: "signin" | "signup") {
  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set("mode", mode);
  window.location.assign(authUrl.toString());
}