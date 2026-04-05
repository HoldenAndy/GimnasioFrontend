'use client';

import { useEffect, useState } from 'react';
import { obtenerClientes, crearCliente, actualizarCliente, eliminarCliente, reactivarCliente } from '@/services/clientes.service';
import { ClienteResponseDto, ClienteRequestDto, PageResponse } from '@/types/clientes.dto';
import ModalFormCliente from '@/components/clientes/ModalFormCliente';
import ModalNotasMedicas from '@/components/clientes/ModalNotasMedicas';
import FiltrosClientes from '@/components/clientes/FiltrosClientes';
import TablaClientes from '@/components/clientes/TablaClientes';
import ExpedienteCliente from '@/components/clientes/ExpedienteCliente';

export default function ClientesPage() {
  const [pageData, setPageData] = useState<PageResponse<ClienteResponseDto> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado de pestañas
  const [tabActual, setTabActual] = useState<'activos' | 'inactivos'>('activos');
  
  // Estados de modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotasModalOpen, setIsNotasModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<ClienteResponseDto | null>(null);
  const [selectedNotas, setSelectedNotas] = useState('');
  const [selectedClienteNombre, setSelectedClienteNombre] = useState('');
  
  // Estados del Expediente (Slide-over)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteResponseDto | null>(null);
  const [isExpedienteOpen, setIsExpedienteOpen] = useState(false);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    cargarClientes(currentPage);
  }, [currentPage]);

  // Recargar cuando cambia el tab
  useEffect(() => {
    setCurrentPage(0);
    cargarClientes(0);
  }, [tabActual]);

  const cargarClientes = async (page: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const estadoActivo = tabActual === 'activos';
      const data = await obtenerClientes(page, 10, searchTerm, fechaInicio, fechaFin, estadoActivo);
      setPageData(data);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    setCurrentPage(0);
    cargarClientes(0);
  };

  const handleLimpiar = () => {
    setSearchTerm('');
    setFechaInicio('');
    setFechaFin('');
    setCurrentPage(0);
    setLoading(true);
    setError(null);
    const estadoActivo = tabActual === 'activos';
    obtenerClientes(0, 10, '', '', '', estadoActivo)
      .then((data) => setPageData(data))
      .catch((err) => {
        setError('Error al cargar los clientes');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleGuardarCliente = async (datosLimpios: ClienteRequestDto, id?: string) => {
    if (id) {
      await actualizarCliente(id, datosLimpios);
    } else {
      await crearCliente(datosLimpios);
    }
    cargarClientes(currentPage);
  };

  const handleEliminar = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al cliente ${nombre}?`)) {
      return;
    }

    try {
      await eliminarCliente(id);
      cargarClientes(currentPage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al eliminar cliente: ${errorMessage}`);
    }
  };

  const handleReactivar = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas reactivar al cliente ${nombre}?`)) {
      return;
    }

    try {
      await reactivarCliente(id);
      alert(`Cliente ${nombre} reactivado exitosamente`);
      cargarClientes(currentPage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al reactivar cliente: ${errorMessage}`);
    }
  };

  const abrirModalCreacion = () => {
    setClienteEditando(null);
    setIsModalOpen(true);
  };

  const abrirModalEdicion = (cliente: ClienteResponseDto) => {
    setClienteEditando(cliente);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setClienteEditando(null);
  };

  const abrirNotasModal = (cliente: ClienteResponseDto) => {
    setSelectedNotas(cliente.notasMedicas || '');
    setSelectedClienteNombre(`${cliente.nombres} ${cliente.apellidos}`);
    setIsNotasModalOpen(true);
  };

  const cerrarNotasModal = () => {
    setIsNotasModalOpen(false);
    setSelectedNotas('');
    setSelectedClienteNombre('');
  };

  const handleVerPerfil = (cliente: ClienteResponseDto) => {
    setClienteSeleccionado(cliente);
    setIsExpedienteOpen(true);
  };

  const cerrarExpediente = () => {
    setIsExpedienteOpen(false);
    setClienteSeleccionado(null);
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto min-h-0">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Clientes
        </h1>
        <button
          onClick={abrirModalCreacion}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="text-xl">+</span>
          <span>Nuevo Cliente</span>
        </button>
      </header>

      {/* Tabs */}
      <div className="shrink-0 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setTabActual('activos')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                tabActual === 'activos'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clientes Activos
            </button>
            <button
              onClick={() => setTabActual('inactivos')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                tabActual === 'inactivos'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clientes Inactivos
            </button>
          </nav>
        </div>
      </div>

      {/* Filtros */}
      <div className="shrink-0">
        <FiltrosClientes
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          fechaFin={fechaFin}
          setFechaFin={setFechaFin}
          onBuscar={handleBuscar}
          onLimpiar={handleLimpiar}
        />
      </div>

      {/* Tabla */}
      <TablaClientes
        pageData={pageData}
        loading={loading}
        error={error}
        tabActual={tabActual}
        onPageChange={setCurrentPage}
        onEdit={abrirModalEdicion}
        onDelete={handleEliminar}
        onViewNotas={abrirNotasModal}
        onReactivar={handleReactivar}
        onVerPerfil={handleVerPerfil}
      />

      {/* Modales */}
      <ModalFormCliente
        isOpen={isModalOpen}
        onClose={cerrarModal}
        clienteEditando={clienteEditando}
        onGuardar={handleGuardarCliente}
      />

      <ModalNotasMedicas
        isOpen={isNotasModalOpen}
        onClose={cerrarNotasModal}
        notas={selectedNotas}
        clienteNombre={selectedClienteNombre}
      />

      {/* Expediente Cliente (Slide-over) */}
      <ExpedienteCliente
        isOpen={isExpedienteOpen}
        onClose={cerrarExpediente}
        cliente={clienteSeleccionado}
      />
    </div>
  );
}
