export interface PlanResponseDto {
  id: string;
  nombre: string;
  descripcion?: string;
  duracionDias: number;
  precio: number;
  estadoActivo: boolean;
}

export interface PlanRequestDto {
  nombre: string;
  descripcion?: string;
  duracionDias: number;
  precio: number;
}

// Re-exportamos PageResponse para uso en el módulo de planes
export type { PageResponse } from './clientes.dto';