import type { LoginRequest, AuthResponse, AuthError } from '@/types/auth.dto';
import { API_BASE_URL } from './api';

const AUTH_ENDPOINT = `${API_BASE_URL}/auth/login`;

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(AUTH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const data: AuthResponse = await response.json();
      return data;
    }

    const error: AuthError = {
      message: getErrorMessage(response.status),
      status: response.status,
    };

    throw error;
  } catch (error) {
    if (error instanceof TypeError || (error as any).name === 'NetworkError') {
      const networkError: AuthError = {
        message: 'Error de conexión. Verifique su conexión a internet',
        status: 0,
      };
      throw networkError;
    }

    if (isAuthError(error)) {
      throw error;
    }

    const unexpectedError: AuthError = {
      message: 'Error inesperado. Intente nuevamente',
      status: 0,
    };
    throw unexpectedError;
  }
}

function getErrorMessage(status: number): string {
  switch (status) {
    case 401:
      return 'Credenciales inválidas';
    case 500:
      return 'Error del servidor. Intente nuevamente';
    default:
      return 'Error inesperado. Intente nuevamente';
  }
}

function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error &&
    typeof (error as AuthError).message === 'string' &&
    typeof (error as AuthError).status === 'number'
  );
}
