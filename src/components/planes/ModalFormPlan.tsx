'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { PlanResponseDto, PlanRequestDto } from '@/types/planes.dto';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planEditando: PlanResponseDto | null;
  onGuardar: (datosLimpios: PlanRequestDto, id?: string) => Promise<void>;
}

export default function ModalFormPlan({ isOpen, onClose, planEditando, onGuardar }: Props) {
  const [formData, setFormData] = useState<PlanRequestDto>({
    nombre: '',
    descripcion: '',
    duracionDias: 30,
    precio: 0,
  });
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    if (planEditando) {
      setFormData({
        nombre: planEditando.nombre,
        descripcion: planEditando.descripcion || '',
        duracionDias: planEditando.duracionDias,
        precio: planEditando.precio,
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        duracionDias: 30,
        precio: 0,
      });
    }
    setModalError(null);
  }, [planEditando]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalError(null);

    try {
      const datosLimpios: PlanRequestDto = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() === '' ? undefined : formData.descripcion?.trim(),
        duracionDias: parseInt(formData.duracionDias.toString(), 10),
        precio: parseFloat(formData.precio.toString()),
      };

      await onGuardar(datosLimpios, planEditando?.id);
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
            {planEditando ? 'Editar Plan' : 'Crear Nuevo Plan'}
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
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Plan
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                placeholder="Ej: Plan Mensual, Plan Anual"
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (Opcional)
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe los beneficios del plan..."
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Duración y Precio en Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Duración */}
              <div>
                <label htmlFor="duracionDias" className="block text-sm font-medium text-gray-700 mb-1">
                  Duración (días)
                </label>
                <input
                  type="number"
                  id="duracionDias"
                  name="duracionDias"
                  value={formData.duracionDias}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="30"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                />
              </div>

              {/* Precio */}
              <div>
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (S/)
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="150.00"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                />
              </div>
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
              {planEditando ? 'Actualizar Plan' : 'Guardar Plan'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
