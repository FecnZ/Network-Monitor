import type { ReactNode } from 'react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface Props {
  variant: 'success' | 'danger' | 'neutral'
  children: ReactNode
}

const variants = {
  success: `bg-emerald-500/15 ${AppColors.success} shadow-emerald-500/20`,
  danger: `bg-rose-500/15 ${AppColors.error} shadow-rose-500/20`,
  neutral: `bg-slate-500/15 ${AppColors.textMuted} shadow-slate-500/10`,
}

export function Badge({ variant, children }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 ${AppText.caption} font-medium shadow-sm ${variants[variant]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          variant === 'success'
            ? `${AppColors.successBg} animate-pulse`
            : variant === 'danger'
              ? AppColors.errorBg
              : 'bg-slate-400'
        }`}
      />
      {children}
    </span>
  )
}
