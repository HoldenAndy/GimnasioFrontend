import { API_BASE_URL, getAuthHeaders } from './api';
import { SuscripcionRequestDto, SuscripcionResponseDto } from '@/types/suscripciones.dto';
import { PageResponse } from '@/types/clientes.dto';

const ENDPOINT = `${API_BASE_URL}/suscripciones`;

export async function obtenerSuscripciones(page: number = 0, size: number = 10): Promise<PageResponse<SuscripcionResponseDto>> {
  const response = await fetch(`${ENDPOINT}?page=${page}&size=${size}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Error al obtener suscripciones');
  return response.json();
}

export async function crearSuscripcion(data: SuscripcionRequestDto): Promise<SuscripcionResponseDto> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Error al crear la suscripción');
  }
  return response.json();
}

export async function cancelarSuscripcion(id: string): Promise<SuscripcionResponseDto> {
  const response = await fetch(`${ENDPOINT}/cancelarSuscripcion/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Error al cancelar la suscripción');
  }
  return response.json();
}

export async function obtenerSuscripcionesPorCliente(idCliente: string): Promise<SuscripcionResponseDto[]> {
  const response = await fetch(`${ENDPOINT}/cliente/${idCliente}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Error al obtener el historial de suscripciones');
  return response.json();
}