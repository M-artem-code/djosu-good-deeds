import type { UserPublic } from "./types";

export interface AuthResponse {
  accessToken: string;
  user: UserPublic;
}
