import { Edit, Trash2, FileText, RefreshCw } from 'lucide-react';
import { ClienteResponseDto, PageResponse } from '@/types/clientes.dto';

interface Props {
  pageData: PageResponse<ClienteResponseDto> | null;
  loading: boolean;
  error: string | null;
  tabActual: 'activos' | 'inactivos';
  onPageChange: (newPage: number) => void;
  onEdit: (cliente: ClienteResponseDto) => void;
  onDelete: (id: string, nombre: string) => void;
  onViewNotas: (cliente: ClienteResponseDto) => void;
  onReactivar: (id: string, nombre: string) => void;
  onVerPerfil: (cliente: ClienteResponseDto) => void;
}

export default function TablaClientes({
  pageData,
  loading,
  error,
  tabActual,
  onPageChange,
  onEdit,
  onDelete,
  onViewNotas,
  onReactivar,
  onVerPerfil
}: Props) {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 border-t border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow flex flex-col flex-1 min-h-0">
      {/* Contenedor escrolleable de la tabla */}
      <div className="overflow-x-auto overflow-y-auto flex-1 relative">
        <table className="w-full">
          {/* Sticky Header */}
          <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Registro
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pageData?.content.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {tabActual === 'activos' 
                    ? 'No hay clientes activos registrados' 
                    : 'No hay clientes inactivos'}
                </td>
              </tr>
            ) : (
              pageData?.content.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {cliente.tipoDocumento}
                    </div>
                    <div className="text-sm text-gray-500">
                      {cliente.numeroDocumento}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onVerPerfil(cliente)}
                      className="text-sm font-bold text-blue-600 hover:underline cursor-pointer transition-colors"
                    >
                      {cliente.apellidos} {cliente.nombres}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {cliente.correo}
                    </div>
                    <div className="text-sm text-gray-500">
                      {cliente.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatearFecha(cliente.fechaRegistro)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-3">
                      {/* Botón de Notas Médicas - Siempre visible */}
                      {cliente.notasMedicas ? (
                        <button
                          onClick={() => onViewNotas(cliente)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Ver notas médicas"
                        >
                          <FileText size={18} />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="text-gray-400 cursor-not-allowed"
                          title="No hay notas médicas"
                        >
                          <FileText size={18} />
                        </button>
                      )}

                      {/* Acciones según el tab actual */}
                      {tabActual === 'activos' ? (
                        <>
                          {/* Editar - Solo en activos */}
                          <button
                            onClick={() => onEdit(cliente)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          {/* Eliminar - Solo en activos */}
                          <button
                            onClick={() => onDelete(cliente.id, `${cliente.nombres} ${cliente.apellidos}`)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Reactivar - Solo en inactivos */}
                          <button
                            onClick={() => onReactivar(cliente.id, `${cliente.nombres} ${cliente.apellidos}`)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Reactivar cliente"
                          >
                            <RefreshCw size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación anclada al fondo (shrink-0 para que no se aplaste) */}
      {pageData && (
        <div className="flex justify-between items-center p-4 bg-white border-t border-gray-200 shrink-0">
          <div className="text-sm text-gray-700">
            Mostrando {pageData.content.length} clientes de {pageData.totalElements} en total
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pageData.number - 1)}
              disabled={pageData.first || pageData.number === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <div className="px-4 py-2 text-gray-700">
              Página {pageData.number + 1} de {pageData.totalPages}
            </div>
            <button
              onClick={() => onPageChange(pageData.number + 1)}
              disabled={pageData.last}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
