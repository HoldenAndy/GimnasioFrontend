'use client';

import { useEffect, useState } from 'react';
import { obtenerPlanes, crearPlan, actualizarPlan, eliminarPlan } from '@/services/planes.service';
import { PlanResponseDto, PlanRequestDto, PageResponse } from '@/types/planes.dto';
import ModalFormPlan from '@/components/planes/ModalFormPlan';
import TablaPlanes from '@/components/planes/TablaPlanes';

export default function PlanesPage() {
  const [pageData, setPageData] = useState<PageResponse<PlanResponseDto> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planEditando, setPlanEditando] = useState<PlanResponseDto | null>(null);

  useEffect(() => {
    cargarPlanes(currentPage);
  }, [currentPage]);

  const cargarPlanes = async (page: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerPlanes(page, 10);
      setPageData(data);
    } catch (err) {
      setError('Error al cargar los planes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async (datosLimpios: PlanRequestDto, id?: string) => {
    if (id) {
      await actualizarPlan(id, datosLimpios);
    } else {
      await crearPlan(datosLimpios);
    }
    cargarPlanes(currentPage);
  };

  const handleEliminar = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el plan "${nombre}"?`)) {
      return;
    }

    try {
      await eliminarPlan(id);
      cargarPlanes(currentPage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al eliminar plan: ${errorMessage}`);
    }
  };

  const abrirModalCreacion = () => {
    setPlanEditando(null);
    setIsModalOpen(true);
  };

  const abrirModalEdicion = (plan: PlanResponseDto) => {
    setPlanEditando(plan);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setPlanEditando(null);
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto min-h-0">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Planes
        </h1>
        <button
          onClick={abrirModalCreacion}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="text-xl">+</span>
          <span>Nuevo Plan</span>
        </button>
      </header>

      {/* Tabla */}
      <TablaPlanes
        pageData={pageData}
        loading={loading}
        error={error}
        onPageChange={setCurrentPage}
        onEdit={abrirModalEdicion}
        onDelete={handleEliminar}
      />

      {/* Modal */}
      <ModalFormPlan
        isOpen={isModalOpen}
        onClose={cerrarModal}
        planEditando={planEditando}
        onGuardar={handleGuardar}
      />
    </div>
  );
}
