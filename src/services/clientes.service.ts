import { API_BASE_URL, getAuthHeaders } from '@/services/api';
import { ClienteResponseDto, ClienteRequestDto, PageResponse } from '@/types/clientes.dto';

export async function obtenerClientes(
  page: number = 0, 
  size: number = 10, 
  search?: string, 
  inicio?: string, 
  fin?: string,
  estadoActivo: boolean = true
): Promise<PageResponse<ClienteResponseDto>> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      estadoActivo: estadoActivo.toString(),
    });

    if (search) params.append('search', search);
    if (inicio) params.append('inicio', inicio);
    if (fin) params.append('fin', fin);

    const response = await fetch(`${API_BASE_URL}/clientes?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener clientes: ${response.status}`);
    }

    const data = await response.json();
    return data; // Spring Boot ya devuelve la estructura exacta
    
  } catch (error) {
    console.error('Error en obtenerClientes:', error);
    throw error;
  }
}

export async function crearCliente(data: ClienteRequestDto): Promise<ClienteResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      // Extraer el mensaje de error del backend (puede venir en diferentes formatos)
      const errorMessage = 
        errorData?.error || 
        errorData?.message || 
        errorData?.mensaje ||
        `Error inesperado del servidor (${response.status})`;
      
      throw new Error(errorMessage);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Error en crearCliente:', error);
    throw error;
  }
}

export async function actualizarCliente(id: string, data: ClienteRequestDto): Promise<ClienteResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      const errorMessage = 
        errorData?.error || 
        errorData?.message || 
        errorData?.mensaje ||
        `Error inesperado del servidor (${response.status})`;
      
      throw new Error(errorMessage);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Error en actualizarCliente:', error);
    throw error;
  }
}

export async function eliminarCliente(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      const errorMessage = 
        errorData?.error || 
        errorData?.message || 
        errorData?.mensaje ||
        `Error inesperado del servidor (${response.status})`;
      
      throw new Error(errorMessage);
    }

    // 204 No Content - no hay body que parsear
    
  } catch (error) {
    console.error('Error en eliminarCliente:', error);
    throw error;
  }
}

export async function reactivarCliente(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}/reactivar`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      const errorMessage = 
        errorData?.error || 
        errorData?.message || 
        errorData?.mensaje ||
        `Error inesperado del servidor (${response.status})`;
      
      throw new Error(errorMessage);
    }

    // 204 No Content - no hay body que parsear
    
  } catch (error) {
    console.error('Error en reactivarCliente:', error);
    throw error;
  }
}
