import type { ReactNode } from 'react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle: ReactNode
  icon: ReactNode
  iconColorClass?: string
  valueColorClass?: string
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  iconColorClass = `${AppColors.primary}`,
  valueColorClass = `${AppColors.textPrimary}`,
}: KpiCardProps) {
  return (
    <div className={`p-5 rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} flex items-center justify-between`}>
      <div className="space-y-1">
        <span className={`${AppText.caption} ${AppColors.textSecondary}`}>{title}</span>
        <div className={`${AppText.h1} ${valueColorClass}`}>{value}</div>
        <div className={`${AppText.caption} font-medium`}>
          {subtitle}
        </div>
      </div>
      <div className={`p-3 rounded-xl ${AppColors.surfaceRaised} ${iconColorClass} border border-current opacity-80`}>
        {icon}
      </div>
    </div>
  )
}
