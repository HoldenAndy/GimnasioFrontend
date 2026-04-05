import { PageResponse } from './clientes.dto';

export type MetodoPago = 'EFECTIVO' | 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'TRANSFERENCIA' | 'YAPE';

export interface PagoResponseDto {
  id: string;
  nombreCliente: string;
  planPagado: string;
  monto: number;
  metodoPago: MetodoPago;
  numeroReferencia?: string;
  fechaPago: string;
  correoCajero: string;
  notas?: string;
  estadoActivo: boolean;
}

export interface PagoRequestDto {
  idSuscripcion: string;
  monto: number;
  metodoPago: MetodoPago;
  numeroReferencia?: string;
  notas?: string;
}