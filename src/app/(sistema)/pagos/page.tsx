'use client';

import { useEffect, useState } from 'react';
import { obtenerHistorialPagos, anularPago } from '@/services/pagos.service';
import { PagoResponseDto } from '@/types/pagos.dto';
import { PageResponse } from '@/types/clientes.dto';
import TablaPagos from '@/components/pagos/TablaPagos';
import BarraFiltrosPagos from '@/components/pagos/BarraFiltrosPagos';

export default function PagosPage() {
  const [pageData, setPageData] = useState<PageResponse<PagoResponseDto> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  useEffect(() => {
    cargarPagos(currentPage);
  }, [currentPage]);

  const cargarPagos = async (page: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerHistorialPagos(page, 10, searchTerm, fechaDesde, fechaHasta);
      setPageData(data);
    } catch (err) {
      setError('Error al cargar el historial de pagos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    setCurrentPage(0);
    cargarPagos(0);
  };

  const handleLimpiar = () => {
    setSearchTerm('');
    setFechaDesde('');
    setFechaHasta('');
    setCurrentPage(0);
    setLoading(true);
    setError(null);
    obtenerHistorialPagos(0, 10, '', '', '')
      .then((data) => setPageData(data))
      .catch((err) => {
        setError('Error al cargar el historial de pagos');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleAnular = async (id: string, nombreCliente: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas anular el pago de ${nombreCliente}?`)) {
      return;
    }

    try {
      await anularPago(id);
      alert(`Pago de ${nombreCliente} anulado exitosamente`);
      cargarPagos(currentPage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al anular pago: ${errorMessage}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto min-h-0">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Historial de Pagos / Caja
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Visualiza y gestiona todos los pagos registrados en el sistema
          </p>
        </div>
      </header>

      {/* Barra de Filtros */}
      <div className="shrink-0">
        <BarraFiltrosPagos
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          fechaDesde={fechaDesde}
          setFechaDesde={setFechaDesde}
          fechaHasta={fechaHasta}
          setFechaHasta={setFechaHasta}
          onBuscar={handleBuscar}
          onLimpiar={handleLimpiar}
        />
      </div>

      {/* Tabla */}
      <TablaPagos
        pageData={pageData}
        loading={loading}
        error={error}
        onPageChange={setCurrentPage}
        onAnular={handleAnular}
      />
    </div>
  );
}
