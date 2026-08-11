import { useDevices } from './hooks/useDevices'
import { DeviceTable } from './components/DeviceTable'
import { DeviceCardList } from './components/DeviceCard'
import { ErrorBoundary } from '../../shared/components/error/ErrorBoundary'
import { FeatureErrorFallback } from '../../shared/components/error/FeatureErrorFallback'
import { Skeleton } from '../../shared/components/ui/Skeleton'
import { useMediaQuery } from '../../shared/hooks/useMediaQuery'

function DevicesContent() {
  const { data: devices, isLoading, isError, error } = useDevices()
  const isDesktop = useMediaQuery('(min-width: 768px)')

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
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
        <p className="text-rose-300">
          Error al cargar dispositivos: {(error as Error).message}
        </p>
      </div>
    )
  }

  if (!devices || devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-700/30 bg-slate-800/30 py-16 text-center">
        <div className="mb-3 text-4xl">📡</div>
        <p className="text-slate-400">No se encontraron dispositivos</p>
        <p className="mt-1 text-sm text-slate-500">
          Ejecuta un escaneo para descubrir tu red
        </p>
      </div>
    )
  }

  return isDesktop ? (
    <DeviceTable devices={devices} />
  ) : (
    <DeviceCardList devices={devices} />
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
