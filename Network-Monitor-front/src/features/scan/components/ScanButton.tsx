import { useState, useCallback } from 'react'
import { useTriggerScan } from '../hooks/useTriggerScan'
import { useScanStatus } from '../hooks/useScanStatus'
import { Button } from '../../../shared/components/ui/Button'

export function ScanButton() {
  const scanMutation = useTriggerScan()
  const [isPolling, setIsPolling] = useState(false)
  const [hasConfirmedStart, setHasConfirmedStart] = useState(false)
  const [prevInProgress, setPrevInProgress] = useState<boolean | undefined>(
    undefined,
  )

  const { data: scanStatus } = useScanStatus(isPolling)
  const inProgress = scanStatus?.inProgress

  // React-recommended pattern: adjust state during render when observed data changes
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (inProgress !== prevInProgress) {
    setPrevInProgress(inProgress)

    if (isPolling && inProgress === true && !hasConfirmedStart) {
      setHasConfirmedStart(true)
    }

    if (isPolling && hasConfirmedStart && inProgress === false) {
      setIsPolling(false)
      setHasConfirmedStart(false)
    }
  }

  const handleScanClick = useCallback(() => {
    scanMutation.mutate(undefined, {
      onSuccess: () => {
        setIsPolling(true)
        setHasConfirmedStart(false)
        setPrevInProgress(undefined)
      },
    })
  }, [scanMutation])

  const isScanning = scanMutation.isPending || isPolling

  return (
    <div>
      <Button onClick={handleScanClick} isLoading={isScanning}>
        {isScanning ? 'Escaneando…' : 'Escanear ahora'}
      </Button>
      {scanMutation.isError && (
        <p className="mt-2 text-sm text-rose-400">
          Error al iniciar: {(scanMutation.error as Error).message}
        </p>
      )}
    </div>
  )
}
