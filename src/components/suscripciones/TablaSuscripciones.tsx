import { Ban, DollarSign } from 'lucide-react';
import { SuscripcionResponseDto, EstadoSuscripcion } from '@/types/suscripciones.dto';
import { PageResponse } from '@/types/clientes.dto';

interface Props {
  pageData: PageResponse<SuscripcionResponseDto> | null;
  loading: boolean;
  error: string | null;
  onPageChange: (newPage: number) => void;
  onCancelar: (id: string, nombreCliente: string) => void;
  onCobrar: (idSuscripcion: string) => void;
}

export default function TablaSuscripciones({
  pageData,
  loading,
  error,
  onPageChange,
  onCancelar,
  onCobrar
}: Props) {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const obtenerEstiloBadge = (estado: EstadoSuscripcion) => {
    switch (estado) {
      case 'ACTIVA':
        return 'bg-green-100 text-green-800';
      case 'VENCIDA':
        return 'bg-red-100 text-red-800';
      case 'PENDIENTE_PAGO':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELADA':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                F. Inicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                F. Fin
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pageData?.content.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No hay suscripciones registradas
                </td>
              </tr>
            ) : (
              pageData?.content.map((suscripcion) => (
                <tr
                  key={suscripcion.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {suscripcion.nombreCliente}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {suscripcion.documentoCliente}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {suscripcion.nombrePlan}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatearFecha(suscripcion.fechaInicio)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatearFecha(suscripcion.fechaFin)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerEstiloBadge(suscripcion.estadoSuscripcion)}`}>
                      {suscripcion.estadoSuscripcion}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-3">
                      {/* Botón Cobrar - Solo para PENDIENTE_PAGO */}
                      {suscripcion.estadoSuscripcion === 'PENDIENTE_PAGO' && (
                        <button
                          onClick={() => onCobrar(suscripcion.id)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Cobrar suscripción"
                        >
                          <DollarSign size={18} />
                        </button>
                      )}
                      
                      {/* Botón Cancelar - No mostrar si ya está CANCELADA */}
                      {suscripcion.estadoSuscripcion !== 'CANCELADA' ? (
                        <button
                          onClick={() => onCancelar(suscripcion.id, suscripcion.nombreCliente)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Cancelar suscripción"
                        >
                          <Ban size={18} />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
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
            Mostrando {pageData.content.length} suscripciones de {pageData.totalElements} en total
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
