import type { ReactNode } from 'react'
import { AppColors } from '../../theme/colors'
import { AppText } from '../../theme/typography'

interface TabItem {
  id: string
  label: string
  icon?: ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className={`flex p-0.5 gap-0.5 ${AppColors.surfaceOverlay} rounded-lg border ${AppColors.borderDefault}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center justify-center gap-1.5 px-3 py-1.5 ${AppText.caption} font-medium rounded-md transition-all duration-200 ease-out border
              ${isActive
                ? `${AppColors.primaryBg} ${AppColors.primary} ${AppColors.primaryBorder}`
                : `${AppColors.textMuted} hover:${AppColors.textPrimary} border-transparent`
              }
            `}
          >
            {tab.icon && (
              <span className={`w-3.5 h-3.5 ${isActive ? AppColors.primary : AppColors.textSecondary}`}>
                {tab.icon}
              </span>
            )}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
