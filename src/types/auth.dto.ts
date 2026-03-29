export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface AuthResponse {
  token: string;
}

export interface AuthError {
  message: string;
  status: number; 
}
