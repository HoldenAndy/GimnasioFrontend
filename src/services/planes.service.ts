import { API_BASE_URL, getAuthHeaders } from './api';
import { PlanRequestDto, PlanResponseDto } from '@/types/planes.dto';
import { PageResponse } from '@/types/clientes.dto';

const ENDPOINT = `${API_BASE_URL}/planes`;

export async function obtenerPlanes(
  page: number = 0, 
  size: number = 10,
  incluirInactivos: boolean = false
): Promise<PageResponse<PlanResponseDto>> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    incluirInactivos: incluirInactivos.toString(),
  });

  const response = await fetch(`${ENDPOINT}?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Error al obtener planes');
  return response.json();
}

export async function crearPlan(data: PlanRequestDto): Promise<PlanResponseDto> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Error al crear el plan');
  }
  return response.json();
}

export async function actualizarPlan(id: string, data: PlanRequestDto): Promise<PlanResponseDto> {
  const response = await fetch(`${ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Error al actualizar el plan');
  }
  return response.json();
}

export async function eliminarPlan(id: string): Promise<void> {
  const response = await fetch(`${ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Error al eliminar el plan');
  }
}