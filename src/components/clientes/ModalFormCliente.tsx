'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { ClienteResponseDto, ClienteRequestDto } from '@/types/clientes.dto';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clienteEditando: ClienteResponseDto | null;
  onGuardar: (datosLimpios: ClienteRequestDto, id?: string) => Promise<void>;
}

export default function ModalFormCliente({ isOpen, onClose, clienteEditando, onGuardar }: Props) {
  const [formData, setFormData] = useState<ClienteRequestDto>({
    nombres: '',
    apellidos: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    correo: '',
    telefono: '',
    contactoEmergencia: '',
    notasMedicas: '',
  });
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    if (clienteEditando) {
      setFormData({
        nombres: clienteEditando.nombres,
        apellidos: clienteEditando.apellidos,
        tipoDocumento: clienteEditando.tipoDocumento,
        numeroDocumento: clienteEditando.numeroDocumento,
        correo: clienteEditando.correo || '',
        telefono: clienteEditando.telefono || '',
        contactoEmergencia: clienteEditando.contactoEmergencia || '',
        notasMedicas: clienteEditando.notasMedicas || '',
      });
    } else {
      setFormData({
        nombres: '',
        apellidos: '',
        tipoDocumento: 'DNI',
        numeroDocumento: '',
        correo: '',
        telefono: '',
        contactoEmergencia: '',
        notasMedicas: '',
      });
    }
    setModalError(null);
  }, [clienteEditando]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTipoDocumentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoTipo = e.target.value;
    setFormData((prev) => ({
      ...prev,
      tipoDocumento: nuevoTipo,
      numeroDocumento: '',
    }));
  };

  const handleNumeroDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value;

    if (formData.tipoDocumento === 'DNI') {
      valor = valor.replace(/\D/g, '').slice(0, 8);
    } else {
      valor = valor.slice(0, 20);
    }

    setFormData((prev) => ({
      ...prev,
      numeroDocumento: valor,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    try {
      const datosLimpios = {
        ...formData,
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        numeroDocumento: formData.numeroDocumento.trim(),
        correo: formData.correo?.trim() === "" ? undefined : formData.correo?.trim(),
        telefono: formData.telefono ? formData.telefono : undefined,
        contactoEmergencia: formData.contactoEmergencia ? formData.contactoEmergencia : undefined,
        notasMedicas: formData.notasMedicas?.trim() === "" ? undefined : formData.notasMedicas?.trim(),
      };

      await onGuardar(datosLimpios as ClienteRequestDto, clienteEditando?.id);
      onClose();
    } catch (error) {
      setModalError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header del Modal */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {clienteEditando ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </header>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error del Modal */}
          {modalError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {modalError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombres */}
            <div>
              <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
                Nombres
              </label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>

            {/* Apellidos */}
            <div>
              <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos
              </label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>

            {/* Tipo Documento */}
            <div>
              <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Documento
              </label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleTipoDocumentoChange}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              >
                <option value="DNI">DNI</option>
                <option value="PASAPORTE">PASAPORTE</option>
                <option value="CARNET_EXT">CARNET_EXT</option>
              </select>
            </div>

            {/* Número Documento */}
            <div>
              <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Documento
              </label>
              <input
                type="text"
                id="numeroDocumento"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleNumeroDocumentoChange}
                required
                maxLength={formData.tipoDocumento === 'DNI' ? 8 : 20}
                placeholder={formData.tipoDocumento === 'DNI' ? 'Solo números (8 dígitos)' : 'Alfanumérico (máx. 20)'}
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>

            {/* Correo */}
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <PhoneInput
                defaultCountry="PE"
                placeholder="Ingresa el teléfono"
                value={formData.telefono}
                onChange={(value) => setFormData({ ...formData, telefono: value || "" })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 text-gray-900"
              />
            </div>

            {/* Contacto Emergencia */}
            <div>
              <label htmlFor="contactoEmergencia" className="block text-sm font-medium text-gray-700 mb-1">
                Contacto de Emergencia
              </label>
              <PhoneInput
                defaultCountry="PE"
                placeholder="Ingresa el contacto de emergencia"
                value={formData.contactoEmergencia}
                onChange={(value) => setFormData({ ...formData, contactoEmergencia: value || "" })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 text-gray-900"
              />
            </div>

            {/* Notas Médicas - Ocupa 2 columnas */}
            <div className="md:col-span-2">
              <label htmlFor="notasMedicas" className="block text-sm font-medium text-gray-700 mb-1">
                Notas Médicas
              </label>
              <textarea
                id="notasMedicas"
                name="notasMedicas"
                value={formData.notasMedicas}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Footer del Modal */}
          <footer className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {clienteEditando ? 'Actualizar Cliente' : 'Guardar Cliente'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
