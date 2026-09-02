import { Sun, Moon } from 'lucide-react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface AppearanceSettingsProps {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

export function AppearanceSettings({ theme, setTheme }: AppearanceSettingsProps) {
  return (
    <div className={`p-6 rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} space-y-6`}>
      <div className={`flex items-center gap-3 pb-4 border-b ${AppColors.borderSubtle}`}>
        <div className={`p-2.5 rounded-xl ${AppColors.primaryBg} ${AppColors.primary} border ${AppColors.primaryBorder}`}>
          <Sun size={22} className={`dark:hidden ${AppColors.amber}`} />
          <Moon size={22} className={`dark:block ${AppColors.indigo}`} />
        </div>
        <div>
          <h2 className={`${AppText.h2} ${AppColors.textPrimary}`}>
            Apariencia
          </h2>
          <p className={`${AppText.caption} ${AppColors.textSecondary}`}>
            Personaliza el tema visual de la aplicación
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className={`${AppText.label} ${AppColors.textPrimary}`}>
          Modo de Visualización
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center justify-center gap-2 cursor-pointer ${AppColors.selectableCardBase} ${theme === 'light'
                ? AppColors.selectableCardActive
                : AppColors.selectableCardIdle
              }`}
          >
            <Sun size={18} />
            <span className={`${AppText.bodySmall} font-medium`}>Claro</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-center gap-2 cursor-pointer ${AppColors.selectableCardBase} ${theme === 'dark'
                ? AppColors.selectableCardActive
                : AppColors.selectableCardIdle
              }`}
          >
            <Moon size={18} />
            <span className={`${AppText.bodySmall} font-medium`}>Oscuro</span>
          </button>
        </div>
      </div>
    </div>
  )
}
