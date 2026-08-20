import { Clock } from 'lucide-react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface LogEntry {
  id: number
  type: 'info' | 'success' | 'warning'
  message: string
  time: string
}

interface RecentEventsLogProps {
  logs: LogEntry[]
}

export function RecentEventsLog({ logs }: RecentEventsLogProps) {
  return (
    <div className={`lg:col-span-2 p-6 rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} space-y-4`}>
      <div className="flex items-center justify-between">
        <h2 className={`${AppText.h2} ${AppColors.textPrimary} flex items-center gap-2`}>
          <Clock className={AppColors.sky} size={20} />
          Registro de Eventos Recientes
        </h2>
        <span className={`${AppText.caption} ${AppColors.textSecondary}`}>Actualizado en vivo</span>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`flex items-start justify-between p-3.5 rounded-xl border ${AppColors.subCardBg} ${AppColors.subCardBorder} hover:${AppColors.subCardHover} transition-colors`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  log.type === 'success'
                    ? AppColors.successBg
                    : log.type === 'warning'
                    ? AppColors.amberDot
                    : AppColors.skyDot
                }`}
              />
              <span className={`${AppText.caption} ${AppColors.textPrimary} font-medium`}>{log.message}</span>
            </div>
            <span className={`${AppText.monoSmall} ${AppColors.textSecondary} shrink-0 ml-4`}>{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
