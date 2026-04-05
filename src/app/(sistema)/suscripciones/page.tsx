'use client';

import { useEffect, useState } from 'react';
import { obtenerSuscripciones, crearSuscripcion, cancelarSuscripcion } from '@/services/suscripciones.service';
import { obtenerClientes } from '@/services/clientes.service';
import { obtenerPlanes } from '@/services/planes.service';
import { registrarPago } from '@/services/pagos.service';
import { SuscripcionResponseDto, SuscripcionRequestDto } from '@/types/suscripciones.dto';
import { ClienteResponseDto, PageResponse } from '@/types/clientes.dto';
import { PlanResponseDto } from '@/types/planes.dto';
import { PagoRequestDto } from '@/types/pagos.dto';
import ModalFormSuscripcion from '@/components/suscripciones/ModalFormSuscripcion';
import TablaSuscripciones from '@/components/suscripciones/TablaSuscripciones';
import ModalFormPago from '@/components/pagos/ModalFormPago';

export default function SuscripcionesPage() {
  const [pageData, setPageData] = useState<PageResponse<SuscripcionResponseDto> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Datos para el modal de suscripción
  const [clientesActivos, setClientesActivos] = useState<ClienteResponseDto[]>([]);
  const [planesActivos, setPlanesActivos] = useState<PlanResponseDto[]>([]);
  
  // Estado del modal de suscripción
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados del modal de pago
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
  const [suscripcionAPagar, setSuscripcionAPagar] = useState<string | null>(null);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    cargarSuscripciones(currentPage);
  }, [currentPage]);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar en paralelo: suscripciones, clientes activos y planes
      const [suscripcionesData, clientesData, planesData] = await Promise.all([
        obtenerSuscripciones(0, 10),
        obtenerClientes(0, 1000, undefined, undefined, undefined, true), // Todos los clientes activos
        obtenerPlanes(0, 1000), // Todos los planes
      ]);

      setPageData(suscripcionesData);
      setClientesActivos(clientesData.content);
      setPlanesActivos(planesData.content);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarSuscripciones = async (page: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerSuscripciones(page, 10);
      setPageData(data);
    } catch (err) {
      setError('Error al cargar las suscripciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (datos: SuscripcionRequestDto) => {
    await crearSuscripcion(datos);
    cargarSuscripciones(currentPage);
  };

  const handleCancelar = async (id: string, nombreCliente: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas cancelar la suscripción de ${nombreCliente}?`)) {
      return;
    }

    try {
      await cancelarSuscripcion(id);
      alert(`Suscripción de ${nombreCliente} cancelada exitosamente`);
      cargarSuscripciones(currentPage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al cancelar suscripción: ${errorMessage}`);
    }
  };

  const handleAbrirCobro = (idSuscripcion: string) => {
    setSuscripcionAPagar(idSuscripcion);
    setIsPagoModalOpen(true);
  };

  const handlePagoCompletado = async (datosPago: PagoRequestDto) => {
    try {
      await registrarPago(datosPago);
      alert('Pago registrado exitosamente');
      setIsPagoModalOpen(false);
      setSuscripcionAPagar(null);
      cargarSuscripciones(currentPage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(errorMessage);
    }
  };

  const cerrarPagoModal = () => {
    setIsPagoModalOpen(false);
    setSuscripcionAPagar(null);
  };

  const abrirModalCreacion = () => {
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto min-h-0">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Suscripciones
        </h1>
        <button
          onClick={abrirModalCreacion}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="text-xl">+</span>
          <span>Nueva Suscripción</span>
        </button>
      </header>

      {/* Tabla */}
      <TablaSuscripciones
        pageData={pageData}
        loading={loading}
        error={error}
        onPageChange={setCurrentPage}
        onCancelar={handleCancelar}
        onCobrar={handleAbrirCobro}
      />

      {/* Modal de Suscripción */}
      <ModalFormSuscripcion
        isOpen={isModalOpen}
        onClose={cerrarModal}
        onGuardar={handleCrear}
        clientesActivos={clientesActivos}
        planesActivos={planesActivos}
      />

      {/* Modal de Pago */}
      <ModalFormPago
        isOpen={isPagoModalOpen}
        onClose={cerrarPagoModal}
        onGuardar={handlePagoCompletado}
        idSuscripcion={suscripcionAPagar}
      />
    </div>
  );
}
