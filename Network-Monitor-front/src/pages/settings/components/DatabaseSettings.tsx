import { Database } from 'lucide-react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface DatabaseSettingsProps {
  dbEngine: string
  setDbEngine: (val: string) => void
  historyRetentionDays: string
  setHistoryRetentionDays: (val: string) => void
}

export function DatabaseSettings({
  dbEngine,
  setDbEngine,
  historyRetentionDays,
  setHistoryRetentionDays,
}: DatabaseSettingsProps) {
  return (
    <div className={`p-6 rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} space-y-6`}>
      <div className={`flex items-center gap-3 pb-4 border-b ${AppColors.borderSubtle}`}>
        <div className="p-2.5 rounded-xl bg-purple-500/10 dark:text-purple-400 border border-purple-500/20">
          <Database size={22} />
        </div>
        <div>
          <h2 className={`${AppText.h2} ${AppColors.textPrimary}`}>
            Almacenamiento y Base de Datos
          </h2>
          <p className={`${AppText.caption} ${AppColors.textSecondary}`}>
            Gestión de la capa de persistencia `com.networkmonitor.model`
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={`${AppText.label} ${AppColors.textPrimary}`}>
            Motor de Base de Datos Seleccionado
          </label>
          <select
            value={dbEngine}
            onChange={(e) => setDbEngine(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl ${AppColors.inputBg} ${AppColors.inputBorder} border ${AppColors.textPrimary} focus:outline-none ${AppColors.inputFocusRing} focus:ring-2 ${AppText.bodySmall}`}
          >
            <option value="H2">H2 Database (En memoria / Archivo local)</option>
            <option value="PostgreSQL">PostgreSQL (Producción / Escalable)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className={`${AppText.label} ${AppColors.textPrimary}`}>
            Retención de Historial de Escaneos
          </label>
          <select
            value={historyRetentionDays}
            onChange={(e) => setHistoryRetentionDays(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl ${AppColors.inputBg} ${AppColors.inputBorder} border ${AppColors.textPrimary} focus:outline-none ${AppColors.inputFocusRing} focus:ring-2 ${AppText.bodySmall}`}
          >
            <option value="7">Guardar últimos 7 días</option>
            <option value="30">Guardar últimos 30 días</option>
            <option value="90">Guardar últimos 90 días</option>
            <option value="0">Conservar indefinidamente</option>
          </select>
        </div>
      </div>
    </div>
  )
}
