import { API_BASE_URL, getAuthHeaders } from './api';
import { PagoRequestDto, PagoResponseDto } from '@/types/pagos.dto';
import { PageResponse } from '@/types/clientes.dto';

const ENDPOINT = `${API_BASE_URL}/pagos`;

export async function obtenerHistorialPagos(page: number = 0, size: number = 10): Promise<PageResponse<PagoResponseDto>> {
  const response = await fetch(`${ENDPOINT}?page=${page}&size=${size}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Error al obtener el historial de pagos');
  return response.json();
}

export async function registrarPago(data: PagoRequestDto): Promise<PagoResponseDto> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Error al registrar el pago');
  }
  return response.json();
}

export async function anularPago(id: string): Promise<PagoResponseDto> {
  const response = await fetch(`${ENDPOINT}/anular/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Error al anular el pago');
  }
  return response.json();
}

export async function obtenerPagosPorCliente(idCliente: string): Promise<PagoResponseDto[]> {
  const response = await fetch(`${ENDPOINT}/cliente/${idCliente}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Error al obtener el historial de pagos');
  return response.json();
}