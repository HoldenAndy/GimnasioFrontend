import { API_BASE_URL, getAuthHeaders } from '@/services/api';
import { DashboardResponseDto } from '@/types/reportes.dto';

export async function getDashboardData(): Promise<DashboardResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/reportes/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${response.statusText}. ${errorBody}`
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al obtener datos del dashboard');
  }
}
