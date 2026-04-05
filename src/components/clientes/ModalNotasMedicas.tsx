import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notas: string;
  clienteNombre: string;
}

export default function ModalNotasMedicas({ isOpen, onClose, notas, clienteNombre }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all duration-300">
      {/* Se cambió max-w-md por max-w-2xl para darle más anchura */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Notas Médicas - {clienteNombre}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {/* Se agregó break-words, text-lg y leading-relaxed */}
        <div className="bg-gray-50 p-5 rounded-md text-gray-800 whitespace-pre-wrap break-words text-lg leading-relaxed mt-4 max-h-[60vh] overflow-y-auto border border-gray-200">
          {notas || 'No hay notas médicas registradas.'}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
