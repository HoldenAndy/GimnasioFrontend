import { PageResponse } from './clientes.dto';

export type EstadoSuscripcion = 'ACTIVA' | 'VENCIDA' | 'PENDIENTE_PAGO' | 'CANCELADA';

export interface SuscripcionResponseDto {
  id: string;
  nombreCliente: string;
  documentoCliente: string;
  nombrePlan: string;
  fechaInicio: string; // LocalDate viaja como string 'YYYY-MM-DD'
  fechaFin: string;
  estadoSuscripcion: EstadoSuscripcion;
  planActivo: boolean;
  precioTotal: number;
  saldoPendiente: number;
}

export interface SuscripcionRequestDto {
  idCliente: string;
  idPlan: string;
}