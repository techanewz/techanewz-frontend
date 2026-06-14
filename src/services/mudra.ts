import axios from 'axios';
import { env } from '@/config/env';

// ============================================
// Mudra API types
// ============================================

export interface MudraUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
}

export interface MudraAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: MudraUser;
}

// ============================================
// Mudra Axios client
// ============================================

const mudraClient = axios.create({
  baseURL: env.MUDRA_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', 'X-App-ID': 'techanewz' },
});

// ============================================
// Auth endpoints
// ============================================

export const mudraRegister = (data: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  userName?: string;
}): Promise<{ data: MudraAuthResponse }> =>
  mudraClient.post('/mudra/auth/register', data).then((r) => ({ data: r.data }));

export const mudraLogin = (
  email: string,
  password: string
): Promise<{ data: MudraAuthResponse }> =>
  mudraClient.post('/mudra/auth/login', { email, password }).then((r) => ({ data: r.data }));

export const mudraGoogleSignIn = (
  idToken: string
): Promise<{ data: MudraAuthResponse }> =>
  mudraClient
    .post('/mudra/auth/google/get-access', { idToken })
    .then((r) => ({ data: r.data }));

export const mudraRefreshToken = (
  refreshToken: string
): Promise<{ data: { accessToken: string; refreshToken: string } }> =>
  mudraClient
    .post('/mudra/auth/refresh-token', { refreshToken })
    .then((r) => ({ data: r.data }));

export const mudraLogout = (accessToken: string): Promise<void> =>
  mudraClient
    .post('/mudra/auth/logout', {}, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(() => undefined);
