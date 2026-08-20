import { Clock } from 'lucide-react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface HistoryEntry {
  id: number
  timestamp: string
  online: boolean
}

interface DeviceHistoryTableProps {
  history: HistoryEntry[]
}

export function DeviceHistoryTable({ history }: DeviceHistoryTableProps) {
  if (history.length === 0) {
    return (
      <div className="py-12 text-center">
        <Clock className={`mx-auto mb-3 h-8 w-8 ${AppColors.iconMuted}`} />
        <p className={AppColors.textMuted}>No hay eventos registrados</p>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden rounded-xl border ${AppColors.cardBorder} ${AppColors.subCardBg} mt-4`}>
      <div className="overflow-x-auto">
        <table className={`w-full text-left ${AppText.bodySmall} whitespace-nowrap`}>
          <thead className={`${AppColors.surfaceRaised} ${AppColors.textMuted}`}>
            <tr>
              <th className={`px-4 py-3 ${AppText.label}`}>Estado</th>
              <th className={`px-4 py-3 ${AppText.label}`}>Fecha</th>
              <th className={`px-4 py-3 ${AppText.label}`}>Hora</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${AppColors.borderRow}`}>
            {history.map((entry) => {
              const date = new Date(entry.timestamp)
              const isOnline = entry.online
              return (
                <tr key={entry.id} className={`transition-colors hover:${AppColors.subCardHover}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isOnline ? AppColors.successBg : AppColors.errorBg}`} />
                      <span className={isOnline ? AppColors.success : AppColors.error}>
                        {isOnline ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                  </td>
                  <td className={`px-4 py-3 ${AppColors.textMuted}`}>
                    {date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className={`px-4 py-3 ${AppColors.textSecondary}`}>
                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
