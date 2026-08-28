import { Activity } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface NetworkActivityChartProps {
  data: any[]
}

export function NetworkActivityChart({ data }: NetworkActivityChartProps) {
  return (
    <div className={`lg:col-span-2 p-6 rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${AppText.h2} ${AppColors.textPrimary} flex items-center gap-2`}>
            <Activity className={AppColors.primary} size={20} />
            Actividad y Latencia de Red
          </h2>
          <p className={`${AppText.caption} ${AppColors.textSecondary}`}>
            Telemetría de tiempo de respuesta (ms) y presencia de dispositivos en las últimas 24 hrs
          </p>
        </div>
        <div className={`flex items-center gap-2 ${AppText.caption} ${AppColors.textSecondary}`}>
          <span className="inline-flex items-center gap-1">
            <span className={`w-2.5 h-2.5 rounded-sm ${AppColors.primaryDot}`} /> Latencia (ms)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className={`w-2.5 h-2.5 rounded-sm ${AppColors.skyDot}`} /> Dispositivos
          </span>
        </div>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="devicesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
              itemStyle={{ fontSize: '13px' }}
            />
            <Area type="monotone" dataKey="latency" name="Latencia (ms)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#latencyGrad)" />
            <Area type="monotone" dataKey="devices" name="Dispositivos Activos" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#devicesGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
