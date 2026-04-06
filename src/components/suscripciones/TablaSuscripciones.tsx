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
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(precio);
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
            <div key={i} className="h-20 bg-gray-100 border-t border-gray-200"></div>
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
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Vigencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Finanzas
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
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No hay suscripciones registradas
                </td>
              </tr>
            ) : (
              pageData?.content.map((suscripcion) => (
                <tr
                  key={suscripcion.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* CLIENTE */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {suscripcion.nombreCliente}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {suscripcion.documentoCliente}
                      </div>
                    </div>
                  </td>

                  {/* PLAN */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900">
                        {suscripcion.nombrePlan}
                      </div>
                      {!suscripcion.planActivo && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-600 w-max mt-1">
                          Descontinuado
                        </span>
                      )}
                    </div>
                  </td>

                  {/* VIGENCIA */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {formatearFecha(suscripcion.fechaInicio)} al {formatearFecha(suscripcion.fechaFin)}
                    </div>
                  </td>

                  {/* FINANZAS */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className={`text-sm ${suscripcion.estadoSuscripcion === 'CANCELADA' ? 'text-gray-500' : 'text-gray-800'}`}>
                        Total: {formatearPrecio(suscripcion.precioTotal)}
                      </div>
                      {suscripcion.estadoSuscripcion === 'CANCELADA' ? (
                        <div className="text-xs text-gray-400 mt-0.5">
                          Deuda anulada
                        </div>
                      ) : (
                        <>
                          {suscripcion.saldoPendiente > 0 ? (
                            <div className="text-xs text-red-600 font-medium mt-0.5">
                              Deuda: {formatearPrecio(suscripcion.saldoPendiente)}
                            </div>
                          ) : (
                            <div className="text-xs text-green-600 font-medium mt-0.5">
                              Pagado
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </td>

                  {/* ESTADO */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerEstiloBadge(suscripcion.estadoSuscripcion)}`}>
                      {suscripcion.estadoSuscripcion}
                    </span>
                  </td>

                  {/* ACCIONES */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Botón Cobrar - Mostrar si hay saldo pendiente y no está CANCELADA */}
                      {suscripcion.saldoPendiente > 0 && suscripcion.estadoSuscripcion !== 'CANCELADA' && (
                        <button
                          onClick={() => onCobrar(suscripcion.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                          title={`Cobrar saldo pendiente: ${formatearPrecio(suscripcion.saldoPendiente)}`}
                        >
                          <DollarSign size={14} />
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
                        suscripcion.saldoPendiente === 0 && (
                          <span className="text-gray-400 text-xs">-</span>
                        )
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
