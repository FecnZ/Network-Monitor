import { DevicesFeature } from '../features/devices'
import { ScanFeature } from '../features/scan'
import { AppColors } from '../shared/theme/colors'
import { AppText } from '../shared/theme/typography'

export default function App() {
  return (
    <div className={`min-h-screen ${AppColors.pageBg} p-4 md:p-8`}>
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className={`${AppText.h1} ${AppColors.textPrimary}`}>
            <span className={`${AppColors.primaryGradient} bg-clip-text text-transparent`}>
              Network
            </span>{' '}
            Monitor
          </h1>
          <p className={`mt-0.5 ${AppText.caption} ${AppColors.textSecondary}`}>
            Monitoreo de dispositivos en tu red local
          </p>
        </div>
        <ScanFeature />
      </header>

      {/* Main content */}
      <main>
        <DevicesFeature />
      </main>
    </div>
  )
}
