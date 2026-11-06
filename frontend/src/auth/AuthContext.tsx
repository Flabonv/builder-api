import type { User } from "../types/api";

export type AuthState =
  | { status: "checking" }
  | { status: "anonymous" }
  | { status: "authenticated"; token: string ; user: User}
