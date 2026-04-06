import { Search, X } from 'lucide-react';

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  fechaDesde: string;
  setFechaDesde: (value: string) => void;
  fechaHasta: string;
  setFechaHasta: (value: string) => void;
  onBuscar: () => void;
  onLimpiar: () => void;
}

export default function BarraFiltrosPagos({
  searchTerm,
  setSearchTerm,
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
  onBuscar,
  onLimpiar
}: Props) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onBuscar();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-4">
        {/* Input de Búsqueda */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Buscar por cliente o referencia..."
            className="w-full pl-10 pr-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Fecha Desde */}
        <div className="flex items-center gap-2">
          <label htmlFor="fechaDesde" className="text-sm text-gray-600 whitespace-nowrap">
            Desde:
          </label>
          <input
            type="date"
            id="fechaDesde"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Fecha Hasta */}
        <div className="flex items-center gap-2">
          <label htmlFor="fechaHasta" className="text-sm text-gray-600 whitespace-nowrap">
            Hasta:
          </label>
          <input
            type="date"
            id="fechaHasta"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Botón Buscar */}
        <button
          onClick={onBuscar}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          Buscar
        </button>

        {/* Botón Limpiar */}
        <button
          onClick={onLimpiar}
          className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5"
          title="Limpiar filtros"
        >
          <X size={16} />
          Limpiar
        </button>
      </div>
    </div>
  );
}
