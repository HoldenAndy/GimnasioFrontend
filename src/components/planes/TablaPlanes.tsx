import { Edit, Trash2 } from 'lucide-react';
import { PlanResponseDto, PageResponse } from '@/types/planes.dto';

interface Props {
  pageData: PageResponse<PlanResponseDto> | null;
  loading: boolean;
  error: string | null;
  onPageChange: (newPage: number) => void;
  onEdit: (plan: PlanResponseDto) => void;
  onDelete: (id: string, nombre: string) => void;
}

export default function TablaPlanes({
  pageData,
  loading,
  error,
  onPageChange,
  onEdit,
  onDelete
}: Props) {
  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(precio);
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
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Duración (días)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Precio
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
                  No hay planes registrados
                </td>
              </tr>
            ) : (
              pageData?.content.map((plan) => (
                <tr
                  key={plan.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {plan.nombre}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-md truncate">
                      {plan.descripcion || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {plan.duracionDias} días
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatearPrecio(plan.precio)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onEdit(plan)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(plan.id, plan.nombre)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación anclada al fondo */}
      {pageData && (
        <div className="flex justify-between items-center p-4 bg-white border-t border-gray-200 shrink-0">
          <div className="text-sm text-gray-700">
            Mostrando {pageData.content.length} planes de {pageData.totalElements} en total
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
