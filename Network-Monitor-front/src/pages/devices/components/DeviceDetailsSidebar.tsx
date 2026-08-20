import { Server } from 'lucide-react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import type { Device } from '../../../features/devices/types/device.types'

interface DeviceDetailsSidebarProps {
  device: Device | undefined
}

export function DeviceDetailsSidebar({ device }: DeviceDetailsSidebarProps) {
  return (
    <div className={`p-6 rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} space-y-4`}>
      <div className={`flex items-center gap-3 pb-3 border-b ${AppColors.borderSubtle}`}>
        <Server className={AppColors.indigo} size={20} />
        <h2 className={`${AppText.h2} ${AppColors.textPrimary}`}>Detalles</h2>
      </div>

      {device ? (
        <div className="space-y-4">
          <div>
            <label className={`${AppText.caption} ${AppColors.textSecondary} uppercase tracking-wider`}>Estado Actual</label>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${device.online ? AppColors.successBg : AppColors.errorBg}`} />
              <span className={`${AppText.body} font-medium ${device.online ? AppColors.success : AppColors.error}`}>
                {device.online ? 'En línea' : 'Desconectado'}
              </span>
            </div>
          </div>

          <div>
            <label className={`${AppText.caption} ${AppColors.textSecondary} uppercase tracking-wider`}>Dirección IP</label>
            <p className={`${AppText.mono} ${AppColors.textPrimary} mt-1`}>{device.ipAddress}</p>
          </div>

          <div>
            <label className={`${AppText.caption} ${AppColors.textSecondary} uppercase tracking-wider`}>Dirección MAC</label>
            <p className={`${AppText.mono} ${AppColors.textPrimary} mt-1`}>{device.macAddress ?? '—'}</p>
          </div>

          <div>
            <label className={`${AppText.caption} ${AppColors.textSecondary} uppercase tracking-wider`}>Fabricante</label>
            <p className={`${AppText.bodySmall} ${AppColors.textPrimary} mt-1`}>{device.vendor ?? 'Desconocido'}</p>
          </div>

          <div>
            <label className={`${AppText.caption} ${AppColors.textSecondary} uppercase tracking-wider`}>Última conexión</label>
            <p className={`${AppText.bodySmall} ${AppColors.textPrimary} mt-1`}>{new Date(device.lastSeen).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}
    </div>
  )
}
