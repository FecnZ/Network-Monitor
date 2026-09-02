import { Wifi } from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface DeviceDistributionChartProps {
  data: { name: string; value: number; color: string }[]
  totalDevices: number
}

export function DeviceDistributionChart({ data, totalDevices }: DeviceDistributionChartProps) {
  return (
    <div className={`p-6 rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} flex flex-col justify-between gap-4`}>
      <div>
        <h2 className={`${AppText.h2} ${AppColors.textPrimary} flex items-center gap-2`}>
          <Wifi className={AppColors.teal} size={20} />
          Distribución por Categoría
        </h2>
        <p className={`${AppText.caption} ${AppColors.textSecondary}`}>
          Tipos de equipos conectados en la subred
        </p>
      </div>

      <div className="h-48 w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute text-center">
          <span className={`${AppText.h1} ${AppColors.textPrimary}`}>{totalDevices}</span>
          <span className={`block ${AppText.caption} ${AppColors.textSecondary} uppercase tracking-wider`}>Equipos</span>
        </div>
      </div>

      {/* Legend */}
      <div className={`grid grid-cols-2 gap-2 ${AppText.caption} pt-2 border-t ${AppColors.borderSubtle}`}>
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className={`truncate ${AppColors.textPrimary}`}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
