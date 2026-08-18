import { useState } from 'react'
import { Drawer } from '../../../shared/components/ui/Drawer'
import { useDeviceHistory } from '../hooks/useDeviceHistory'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { Tabs } from '../../../shared/components/ui/Tabs'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'
import { Activity, Clock, List, GitCommitVertical } from 'lucide-react'

interface Props {
  deviceId: number | null
  deviceName?: string
  isOpen: boolean
  onClose: () => void
}

type ViewMode = 'timeline' | 'list'

export function DeviceHistoryDrawer({
  deviceId,
  deviceName,
  isOpen,
  onClose,
}: Props) {
  const { data: history, isLoading, isError } = useDeviceHistory(deviceId)
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Historial: ${deviceName || 'Dispositivo'}`}
    >
      <div className="flex flex-col space-y-6">
        
        {/* Header section with intro and tabs */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className={`h-4 w-4 ${AppColors.primary}`} />
            <p className={`${AppText.caption} ${AppColors.textSecondary}`}>
              Registro de conexiones
            </p>
          </div>
          
          <Tabs 
            activeTab={viewMode}
            onChange={(id) => setViewMode(id as ViewMode)}
            tabs={[
              { id: 'timeline', label: 'Timeline', icon: <GitCommitVertical size={14} /> },
              { id: 'list', label: 'Lista', icon: <List size={14} /> }
            ]} 
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          )}

          {isError && (
            <div className={`rounded-xl border ${AppColors.errorContainerBorder} ${AppColors.errorContainerBg} p-4 text-center`}>
              <p className={`${AppText.bodySmall} ${AppColors.error}`}>
                Ocurrió un error al cargar el historial del dispositivo.
              </p>
            </div>
          )}

          {history && history.length === 0 && (
            <div className="py-12 text-center">
              <Clock className={`mx-auto mb-3 h-8 w-8 ${AppColors.iconMuted}`} />
              <p className={AppColors.textMuted}>No hay eventos registrados</p>
            </div>
          )}

          {/* Timeline View */}
          {history && history.length > 0 && viewMode === 'timeline' && (
            <div className={`relative space-y-0 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 ${AppColors.timelineLine}`}>
              {history.map((entry) => {
                const date = new Date(entry.timestamp)
                const isOnline = entry.online

                return (
                  <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-3">
                    {/* Icon indicator */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 ${AppColors.iconBorder} ${AppColors.iconBg} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow transition-transform duration-300 group-hover:scale-110`}>
                      <div className={`w-3 h-3 rounded-full ${isOnline ? `${AppColors.successBg} ${AppColors.successGlow}` : `${AppColors.errorBg} ${AppColors.errorGlow}`}`}></div>
                    </div>
                    {/* Card */}
                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border ${AppColors.cardBorder} ${AppColors.cardBg} backdrop-blur-sm shadow transition-all duration-300 ${AppColors.cardBgHover} group-hover:-translate-y-1`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`${AppText.value} ${isOnline ? AppColors.success : AppColors.error}`}>
                          {isOnline ? 'Conectado' : 'Desconectado'}
                        </span>
                        <time className={`${AppText.caption} font-medium ${AppColors.textSecondary}`}>
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                      <div className={`${AppText.caption} ${AppColors.textMuted}`}>
                        {date.toLocaleDateString([], {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* List View */}
          {history && history.length > 0 && viewMode === 'list' && (
            <div className={`overflow-hidden rounded-xl border ${AppColors.cardBorder} ${AppColors.cardBg}`}>
              <div className="overflow-x-auto">
                <table className={`w-full text-left ${AppText.bodySmall} whitespace-nowrap`}>
                  <thead className={`${AppColors.surfaceOverlay} ${AppColors.textMuted}`}>
                    <tr>
                      <th className={`px-4 py-3 ${AppText.label}`}>Estado</th>
                      <th className={`px-4 py-3 ${AppText.label}`}>Fecha</th>
                      <th className={`px-4 py-3 ${AppText.label}`}>Hora</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${AppColors.cardBorder}`}>
                    {history.map((entry) => {
                      const date = new Date(entry.timestamp)
                      const isOnline = entry.online
                      return (
                        <tr key={entry.id} className={`transition-colors ${AppColors.cardBgHover}`}>
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
          )}
        </div>
      </div>
    </Drawer>
  )
}
