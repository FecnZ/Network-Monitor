interface Props {
  featureName: string
  error: Error
  onRetry: () => void
}

export function FeatureErrorFallback({ featureName, error, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center backdrop-blur-sm">
      <div className="mb-3 text-4xl">⚠️</div>
      <h3 className="mb-1 text-lg font-semibold text-rose-300">
        Error en {featureName}
      </h3>
      <p className="mb-4 max-w-sm text-sm text-slate-400">
        {error.message}
      </p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-rose-500/20 px-4 py-2 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/30"
      >
        Reintentar
      </button>
    </div>
  )
}
