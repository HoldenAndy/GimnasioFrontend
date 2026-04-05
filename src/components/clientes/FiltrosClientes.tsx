interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  fechaInicio: string;
  setFechaInicio: (v: string) => void;
  fechaFin: string;
  setFechaFin: (v: string) => void;
  onBuscar: () => void;
  onLimpiar: () => void;
}

export default function FiltrosClientes({
  searchTerm,
  setSearchTerm,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  onBuscar,
  onLimpiar
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Buscar (DNI, Nombre, Apellido)
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar cliente..."
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-1">
          Desde
        </label>
        <input
          type="date"
          id="fechaInicio"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-1">
          Hasta
        </label>
        <input
          type="date"
          id="fechaFin"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex gap-2 items-end">
        <button
          onClick={onBuscar}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Buscar
        </button>
        <button
          onClick={onLimpiar}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
