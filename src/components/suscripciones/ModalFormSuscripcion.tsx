'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { SuscripcionRequestDto } from '@/types/suscripciones.dto';
import { ClienteResponseDto } from '@/types/clientes.dto';
import { PlanResponseDto } from '@/types/planes.dto';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (datos: SuscripcionRequestDto) => Promise<void>;
  clientesActivos: ClienteResponseDto[];
  planesActivos: PlanResponseDto[];
}

export default function ModalFormSuscripcion({ 
  isOpen, 
  onClose, 
  onGuardar, 
  clientesActivos, 
  planesActivos 
}: Props) {
  const [formData, setFormData] = useState<SuscripcionRequestDto>({
    idCliente: '',
    idPlan: '',
  });
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Resetear formulario al abrir
      setFormData({
        idCliente: '',
        idPlan: '',
      });
      setModalError(null);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalError(null);

    if (!formData.idCliente || !formData.idPlan) {
      setModalError('Debes seleccionar un cliente y un plan');
      return;
    }

    try {
      await onGuardar(formData);
      onClose();
    } catch (error) {
      setModalError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Crear Nueva Suscripción
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

          <div className="space-y-4">
            {/* Select Cliente */}
            <div>
              <label htmlFor="idCliente" className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                id="idCliente"
                name="idCliente"
                value={formData.idCliente}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona un cliente</option>
                {clientesActivos.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombres} {cliente.apellidos} - {cliente.numeroDocumento}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Plan */}
            <div>
              <label htmlFor="idPlan" className="block text-sm font-medium text-gray-700 mb-1">
                Plan
              </label>
              <select
                id="idPlan"
                name="idPlan"
                value={formData.idPlan}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona un plan</option>
                {planesActivos.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
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
              Crear Suscripción
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
