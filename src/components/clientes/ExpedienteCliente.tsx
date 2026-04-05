'use client';

import { useEffect, useState } from 'react';
import { X, Calendar, CreditCard } from 'lucide-react';
import { ClienteResponseDto } from '@/types/clientes.dto';
import { SuscripcionResponseDto, EstadoSuscripcion } from '@/types/suscripciones.dto';
import { PagoResponseDto } from '@/types/pagos.dto';
import { obtenerSuscripcionesPorCliente } from '@/services/suscripciones.service';
import { obtenerPagosPorCliente } from '@/services/pagos.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteResponseDto | null;
}

export default function ExpedienteCliente({ isOpen, onClose, cliente }: Props) {
  const [suscripciones, setSuscripciones] = useState<SuscripcionResponseDto[]>([]);
  const [pagos, setPagos] = useState<PagoResponseDto[]>([]);
  const [tabActual, setTabActual] = useState<'suscripciones' | 'pagos'>('suscripciones');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && cliente) {
      cargarDatosCliente();
    }
  }, [isOpen, cliente]);

  const cargarDatosCliente = async () => {
    if (!cliente) return;
    
    setLoading(true);
    try {
      const [suscripcionesData, pagosData] = await Promise.all([
        obtenerSuscripcionesPorCliente(cliente.id),
        obtenerPagosPorCliente(cliente.id),
      ]);
      setSuscripciones(suscripcionesData);
      setPagos(pagosData);
    } catch (error) {
      console.error('Error al cargar datos del cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatearFechaHora = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  const formatearMetodoPago = (metodo: string) => {
    const metodos: Record<string, string> = {
      'EFECTIVO': 'Efectivo',
      'TARJETA_CREDITO': 'T. Crédito',
      'TARJETA_DEBITO': 'T. Débito',
      'TRANSFERENCIA': 'Transferencia',
      'YAPE': 'Yape',
    };
    return metodos[metodo] || metodo;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel Lateral */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto">
        {cliente && (
          <div className="p-6">
            {/* Cabecera */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {cliente.nombres} {cliente.apellidos}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium">{cliente.tipoDocumento}: {cliente.numeroDocumento}</span>
                  <span>•</span>
                  <span>{cliente.telefono}</span>
                </div>
                {cliente.correo && (
                  <div className="text-sm text-gray-600 mt-1">
                    {cliente.correo}
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex gap-8">
                  <button
                    onClick={() => setTabActual('suscripciones')}
                    className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                      tabActual === 'suscripciones'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Calendar size={18} />
                    Historial de Membresías
                  </button>
                  <button
                    onClick={() => setTabActual('pagos')}
                    className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                      tabActual === 'pagos'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard size={18} />
                    Estado de Cuenta
                  </button>
                </nav>
              </div>
            </div>

            {/* Contenido */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-pulse text-gray-500">Cargando...</div>
              </div>
            ) : (
              <>
                {/* Tab Suscripciones */}
                {tabActual === 'suscripciones' && (
                  <div className="space-y-4">
                    {suscripciones.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No hay suscripciones registradas
                      </div>
                    ) : (
                      suscripciones.map((suscripcion) => (
                        <div
                          key={suscripcion.id}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {suscripcion.nombrePlan}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {formatearFecha(suscripcion.fechaInicio)} - {formatearFecha(suscripcion.fechaFin)}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerEstiloBadge(suscripcion.estadoSuscripcion)}`}>
                              {suscripcion.estadoSuscripcion}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab Pagos */}
                {tabActual === 'pagos' && (
                  <div className="space-y-3">
                    {pagos.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No hay pagos registrados
                      </div>
                    ) : (
                      pagos.map((pago) => (
                        <div
                          key={pago.id}
                          className={`bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow ${
                            !pago.estadoActivo ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl font-bold text-gray-900">
                                {formatearPrecio(pago.monto)}
                              </div>
                              {pago.estadoActivo ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Completado
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Anulado
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Fecha:</span>
                              <span className="ml-2 text-gray-900">{formatearFechaHora(pago.fechaPago)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Método:</span>
                              <span className="ml-2 text-gray-900">{formatearMetodoPago(pago.metodoPago)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Plan:</span>
                              <span className="ml-2 text-gray-900">{pago.planPagado}</span>
                            </div>
                            {pago.numeroReferencia && (
                              <div>
                                <span className="text-gray-500">Ref:</span>
                                <span className="ml-2 text-gray-900">{pago.numeroReferencia}</span>
                              </div>
                            )}
                          </div>
                          {pago.notas && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <span className="text-xs text-gray-500">Notas: </span>
                              <span className="text-xs text-gray-700">{pago.notas}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
