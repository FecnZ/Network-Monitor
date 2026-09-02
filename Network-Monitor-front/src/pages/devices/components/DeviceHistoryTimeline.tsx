import { Clock } from 'lucide-react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface HistoryEntry {
  id: number
  timestamp: string
  online: boolean
}

interface DeviceHistoryTimelineProps {
  history: HistoryEntry[]
}

export function DeviceHistoryTimeline({ history }: DeviceHistoryTimelineProps) {
  if (history.length === 0) {
    return (
      <div className="py-12 text-center">
        <Clock className={`mx-auto mb-3 h-8 w-8 ${AppColors.iconMuted}`} />
        <p className={AppColors.textMuted}>No hay eventos registrados</p>
      </div>
    )
  }

  return (
    <div
      className={`relative space-y-0 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 ${AppColors.timelineLine} pt-2`}
    >
      {history.map((entry) => {
        const date = new Date(entry.timestamp)
        const isOnline = entry.online

        return (
          <div
            key={entry.id}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-3"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-4 ${AppColors.iconBorder} ${AppColors.iconBg} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow transition-transform duration-300 z-10`}
            >
              <div
                className={`w-3 h-3 rounded-full ${isOnline ? `${AppColors.successBg} ${AppColors.successGlow}` : `${AppColors.errorBg} ${AppColors.errorGlow}`}`}
              />
            </div>
            <div
              className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border ${AppColors.cardBorder} ${AppColors.subCardBg} backdrop-blur-sm shadow-sm transition-all duration-300 hover:${AppColors.subCardHover}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`${AppText.value} ${isOnline ? AppColors.success : AppColors.error}`}>
                  {isOnline ? 'Conectado' : 'Desconectado'}
                </span>
                <time className={`${AppText.caption} font-medium ${AppColors.textSecondary}`}>
                  {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
              <div className={`${AppText.caption} ${AppColors.textMuted}`}>
                {date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
