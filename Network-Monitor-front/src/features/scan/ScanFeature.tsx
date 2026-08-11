import { ErrorBoundary } from '../../shared/components/error/ErrorBoundary'
import { FeatureErrorFallback } from '../../shared/components/error/FeatureErrorFallback'
import { ScanButton } from './components/ScanButton'

export function ScanFeature() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <FeatureErrorFallback
          featureName="Escaneo"
          error={error}
          onRetry={reset}
        />
      )}
    >
      <ScanButton />
    </ErrorBoundary>
  )
}
