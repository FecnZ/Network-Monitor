import { AppColors } from '../../theme/colors'
import { AppText } from '../../theme/typography'

interface Props {
  featureName: string
  error: Error
  onRetry: () => void
}

export function FeatureErrorFallback({ featureName, error, onRetry }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border ${AppColors.errorContainerBorder} ${AppColors.errorContainerBg} p-8 text-center backdrop-blur-sm`}>
      <div className="mb-3 text-4xl">⚠️</div>
      <h3 className={`mb-1 ${AppText.h3} ${AppColors.error}`}>
        Error en {featureName}
      </h3>
      <p className={`mb-4 max-w-sm ${AppText.bodySmall} ${AppColors.textMuted}`}>
        {error.message}
      </p>
      <button
        onClick={onRetry}
        className={`rounded-lg ${AppColors.errorContainerBg} px-4 py-2 ${AppText.bodySmall} font-medium ${AppColors.error} transition-colors hover:bg-rose-500/30`}
      >
        Reintentar
      </button>
    </div>
  )
}
