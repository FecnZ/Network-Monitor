import { Link } from 'react-router-dom'
import { Server, Activity, ShieldCheck, Zap, ArrowRight, Radio } from 'lucide-react'
import { AppColors } from '../../shared/theme/colors'
import { AppText } from '../../shared/theme/typography'
import { KpiCard } from './components/KpiCard'
import { NetworkActivityChart } from './components/NetworkActivityChart'
import { DeviceDistributionChart } from './components/DeviceDistributionChart'
import { BackendStatusCard } from './components/BackendStatusCard'
import { RecentEventsLog } from './components/RecentEventsLog'

// ── Mock Data ────────────────────────────────────────────────────────────────

const activityData = [
  { time: '00:00', latency: 12, devices: 8 },
  { time: '04:00', latency: 10, devices: 7 },
  { time: '08:00', latency: 18, devices: 11 },
  { time: '12:00', latency: 25, devices: 14 },
  { time: '16:00', latency: 15, devices: 12 },
  { time: '20:00', latency: 14, devices: 10 },
  { time: '23:59', latency: 11, devices: 9 },
]

const deviceDistribution = [
  { name: 'Computadoras / Laptops', value: 4, color: '#38bdf8' },
  { name: 'Móviles / Tablets', value: 5, color: '#34d399' },
  { name: 'Dispositivos IoT / Smart Home', value: 3, color: '#a855f7' },
  { name: 'Servidores / Routers', value: 2, color: '#f59e0b' },
]

const recentLogs = [
  { id: 1, type: 'info' as const, message: 'Escaneo automático completado en subred 192.168.1.0/24', time: 'Hace 5 min' },
  { id: 2, type: 'success' as const, message: 'Nuevo dispositivo reconocido: RaspberryPi-Media (192.168.1.45)', time: 'Hace 18 min' },
  { id: 3, type: 'warning' as const, message: 'Puerto 22 (SSH) detectado abierto en 192.168.1.100', time: 'Hace 1 hora' },
]

const TOTAL_DEVICES = 14

// ── Page ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  return (
    <div className="flex flex-col gap-8 pb-8">

      {/* Hero Banner Header */}
      <div className={`relative overflow-hidden rounded-3xl p-6 md:p-8 border ${AppColors.cardBorder} ${AppColors.cardBg} bg-linear-to-r from-slate-900 via-slate-900/90 to-emerald-950/30`}>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-20 -bottom-10 h-48 w-48 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${AppText.caption} font-semibold ${AppColors.primaryBg} border border-emerald-500/20 ${AppColors.primary}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Red Local Activa: 192.168.1.0/24
            </div>
            <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${AppColors.textOnPrimary}`}>
              Monitor de Red Local
            </h1>
            <p className={`${AppText.body} text-slate-300`}>
              Panel de control y telemetría en tiempo real para el descubrimiento, diagnóstico de puertos y salud de tu infraestructura.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/devices"
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl ${AppText.buttonText} transition-all duration-200 ${AppColors.buttonPrimaryBg} ${AppColors.buttonPrimaryShadow} ${AppColors.buttonPrimaryHover} ${AppColors.textOnPrimary}`}
            >
              <Zap size={18} />
              <span>Ver Dispositivos</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Dispositivos Detectados"
          value={TOTAL_DEVICES}
          subtitle={<span className={AppColors.primary}>+2 hoy en la red</span>}
          icon={<Server size={24} />}
        />
        <KpiCard
          title="Dispositivos En Línea"
          value={9}
          subtitle={
            <span className="text-teal-600 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" /> 64% Actividad
            </span>
          }
          icon={<Activity size={24} />}
          iconColorClass="text-teal-600 dark:text-teal-400"
        />
        <KpiCard
          title="Puertos Abiertos"
          value={24}
          subtitle={<span className="text-indigo-600">Servicios HTTP, SSH, DB</span>}
          icon={<Radio size={24} />}
          iconColorClass="text-indigo-600 dark:text-indigo-400"
        />
        <KpiCard
          title="Estado de Seguridad"
          value="Seguro"
          subtitle={<span className={AppColors.textSecondary}>Sin intrusos detectados</span>}
          icon={<ShieldCheck size={24} />}
          valueColorClass={AppColors.success}
        />
      </div>

      {/* Statistics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NetworkActivityChart data={activityData} />
        <DeviceDistributionChart data={deviceDistribution} totalDevices={TOTAL_DEVICES} />
      </div>

      {/* Backend Architecture Status & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BackendStatusCard />
        <RecentEventsLog logs={recentLogs} />
      </div>

    </div>
  )
}
