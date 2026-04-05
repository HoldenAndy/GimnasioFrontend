'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getDashboardData } from '@/services/reportes.service';
import { DashboardResponseDto } from '@/types/reportes.dto';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDashboardData();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Dashboard error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const MetricCard = ({
    icon: Icon,
    title,
    value,
    isCurrency = false,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: number;
    isCurrency?: boolean;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <p className="text-3xl font-bold text-gray-900">
        {isCurrency ? formatCurrency(value) : value.toLocaleString('es-ES')}
      </p>
    </div>
  );

  const SkeletonCard = () => (
    <div className="bg-gray-200 rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="h-5 w-5 bg-gray-300 rounded"></div>
      </div>
      <div className="h-8 bg-gray-300 rounded w-32"></div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-900 font-semibold">Error al cargar el dashboard</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchData}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex-shrink-0"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Resumen de métricas principales</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : data ? (
            <>
              <MetricCard
                icon={DollarSign}
                title="Recaudación Mensual"
                value={data.recaudacionMensual}
                isCurrency
              />
              <MetricCard
                icon={Users}
                title="Clientes Activos"
                value={data.clientesActivos}
              />
              <MetricCard
                icon={AlertCircle}
                title="Suscripciones por Vencer"
                value={data.suscripcionesPorVencer}
              />
              <MetricCard
                icon={CheckCircle2}
                title="Asistencias Hoy"
                value={data.asistenciasHoy}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
