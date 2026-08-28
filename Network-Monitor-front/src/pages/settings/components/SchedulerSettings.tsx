import { Clock } from 'lucide-react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface SchedulerSettingsProps {
  autoScanInterval: string
  setAutoScanInterval: (val: string) => void
}

export function SchedulerSettings({ autoScanInterval, setAutoScanInterval }: SchedulerSettingsProps) {
  return (
    <div className={`p-6 rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} space-y-6`}>
      <div className={`flex items-center gap-3 pb-4 border-b ${AppColors.borderSubtle}`}>
        <div className={`p-2.5 rounded-xl ${AppColors.indigoBg} ${AppColors.indigo} border ${AppColors.indigoBorder}`}>
          <Clock size={22} />
        </div>
        <div>
          <h2 className={`${AppText.h2} ${AppColors.textPrimary}`}>
            Escaneos Automáticos Programados
          </h2>
          <p className={`${AppText.caption} ${AppColors.textSecondary}`}>
            Módulo `com.networkmonitor.scheduler` (@Scheduled)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={`${AppText.label} ${AppColors.textPrimary}`}>
            Frecuencia del Escaneo Automático
          </label>
          <select
            value={autoScanInterval}
            onChange={(e) => setAutoScanInterval(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl ${AppColors.inputBg} ${AppColors.inputBorder} border ${AppColors.textPrimary} focus:outline-none ${AppColors.inputFocusRing} focus:ring-2 ${AppText.bodySmall}`}
          >
            <option value="15">Cada 15 minutos</option>
            <option value="30">Cada 30 minutos</option>
            <option value="60">Cada 1 hora (Recomendado)</option>
            <option value="360">Cada 6 horas</option>
            <option value="0">Desactivado (Solo manual)</option>
          </select>
        </div>

        <div className={`flex items-center justify-between p-4 rounded-xl border ${AppColors.cardBorder} ${AppColors.cardBg}`}>
          <div>
            <div className={`${AppText.value} ${AppColors.textPrimary}`}>Monitoreo Pasivo de Ping</div>
            <div className={`${AppText.caption} ${AppColors.textSecondary}`}>Verifica la disponibilidad de equipos conocidos cada 60 seg.</div>
          </div>
          <input
            type="checkbox"
            defaultChecked
            className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
