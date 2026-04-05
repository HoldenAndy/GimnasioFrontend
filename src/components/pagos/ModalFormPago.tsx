'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { PagoRequestDto, MetodoPago } from '@/types/pagos.dto';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (datos: PagoRequestDto) => Promise<void>;
  idSuscripcion: string | null;
}

export default function ModalFormPago({ 
  isOpen, 
  onClose, 
  onGuardar, 
  idSuscripcion 
}: Props) {
  const [formData, setFormData] = useState<PagoRequestDto>({
    idSuscripcion: '',
    monto: 0,
    metodoPago: 'EFECTIVO',
    numeroReferencia: '',
    notas: '',
  });
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (!idSuscripcion) {
        setModalError('Error: No se ha seleccionado una suscripción válida');
      } else {
        setModalError(null);
        setFormData({
          idSuscripcion: idSuscripcion,
          monto: 0,
          metodoPago: 'EFECTIVO',
          numeroReferencia: '',
          notas: '',
        });
      }
    }
  }, [isOpen, idSuscripcion]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

    if (!idSuscripcion) {
      setModalError('No se puede registrar el pago sin una suscripción válida');
      return;
    }

    if (formData.monto < 0.1) {
      setModalError('El monto debe ser mayor a 0');
      return;
    }

    try {
      const datosLimpios: PagoRequestDto = {
        idSuscripcion: idSuscripcion,
        monto: parseFloat(formData.monto.toString()),
        metodoPago: formData.metodoPago,
        numeroReferencia: formData.numeroReferencia?.trim() === '' ? undefined : formData.numeroReferencia?.trim(),
        notas: formData.notas?.trim() === '' ? undefined : formData.notas?.trim(),
      };

      await onGuardar(datosLimpios);
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
            Registrar Pago
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
            {/* Monto */}
            <div>
              <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-1">
                Monto (S/)
              </label>
              <input
                type="number"
                id="monto"
                name="monto"
                value={formData.monto}
                onChange={handleInputChange}
                required
                min="0.1"
                step="0.01"
                placeholder="150.00"
                disabled={!idSuscripcion}
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Método de Pago */}
            <div>
              <label htmlFor="metodoPago" className="block text-sm font-medium text-gray-700 mb-1">
                Método de Pago
              </label>
              <select
                id="metodoPago"
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleInputChange}
                required
                disabled={!idSuscripcion}
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
                <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="YAPE">Yape</option>
              </select>
            </div>

            {/* Número de Referencia */}
            <div>
              <label htmlFor="numeroReferencia" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Referencia (Opcional)
              </label>
              <input
                type="text"
                id="numeroReferencia"
                name="numeroReferencia"
                value={formData.numeroReferencia}
                onChange={handleInputChange}
                placeholder="Ej: OP-123456"
                disabled={!idSuscripcion}
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Notas */}
            <div>
              <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-1">
                Notas (Opcional)
              </label>
              <textarea
                id="notas"
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                rows={3}
                placeholder="Observaciones adicionales..."
                disabled={!idSuscripcion}
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
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
              disabled={!idSuscripcion}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Registrar Pago
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
