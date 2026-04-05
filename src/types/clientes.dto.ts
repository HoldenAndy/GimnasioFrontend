export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface ClienteResponseDto {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  telefono: string;
  contactoEmergencia?: string;
  notasMedicas?: string;
  fechaRegistro: string;
}

export interface ClienteRequestDto {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  telefono?: string;
  contactoEmergencia?: string;
  notasMedicas?: string;
}
