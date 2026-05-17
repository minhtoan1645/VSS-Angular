export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  permissions: string[];
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}
