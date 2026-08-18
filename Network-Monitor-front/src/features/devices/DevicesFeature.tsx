import { useState } from 'react'
import { useDevices } from './hooks/useDevices'
import { DeviceTable } from './components/DeviceTable'
import { DeviceCardList } from './components/DeviceCard'
import { DeviceHistoryDrawer } from './components/DeviceHistoryDrawer'
import { ErrorBoundary } from '../../shared/components/error/ErrorBoundary'
import { FeatureErrorFallback } from '../../shared/components/error/FeatureErrorFallback'
import { Skeleton } from '../../shared/components/ui/Skeleton'
import { useMediaQuery } from '../../shared/hooks/useMediaQuery'
import { AppColors } from '../../shared/theme/colors'
import { AppText } from '../../shared/theme/typography'

function DevicesContent() {
  const { data: devices, isLoading, isError, error } = useDevices()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [historyDeviceId, setHistoryDeviceId] = useState<number | null>(null)
  const [historyDeviceName, setHistoryDeviceName] = useState<string | undefined>()

  const handleViewHistory = (id: number, name?: string) => {
    setHistoryDeviceId(id)
    setHistoryDeviceName(name)
  }

  const handleCloseHistory = () => {
    setHistoryDeviceId(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className={`rounded-2xl border ${AppColors.errorContainerBorder} ${AppColors.errorContainerBg} p-6 text-center`}>
        <p className={AppColors.error}>
          Error al cargar dispositivos: {(error as Error).message}
        </p>
      </div>
    )
  }

  if (!devices || devices.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} py-16 text-center`}>
        <div className="mb-3 text-4xl">📡</div>
        <p className={AppColors.textMuted}>No se encontraron dispositivos</p>
        <p className={`mt-1 ${AppText.bodySmall} ${AppColors.textSecondary}`}>
          Ejecuta un escaneo para descubrir tu red
        </p>
      </div>
    )
  }

  return (
    <>
      {isDesktop ? (
        <DeviceTable devices={devices} onViewHistory={handleViewHistory} />
      ) : (
        <DeviceCardList devices={devices} onViewHistory={handleViewHistory} />
      )}

      <DeviceHistoryDrawer
        deviceId={historyDeviceId}
        deviceName={historyDeviceName}
        isOpen={historyDeviceId !== null}
        onClose={handleCloseHistory}
      />
    </>
  )
}

export function DevicesFeature() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <FeatureErrorFallback
          featureName="Dispositivos"
          error={error}
          onRetry={reset}
        />
      )}
    >
      <DevicesContent />
    </ErrorBoundary>
  )
}
