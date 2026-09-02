import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AppColors } from '../../theme/colors'
import { AppText } from '../../theme/typography'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  isLoading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...rest
}: Props) {
  const base = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 ${AppText.buttonText} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50`

  const variants = {
    primary: `${AppColors.buttonPrimaryBg} ${AppColors.textOnPrimary} ${AppColors.buttonPrimaryShadow} ${AppColors.buttonPrimaryHover} ${AppColors.buttonPrimaryRing}`,
    ghost: `${AppColors.buttonGhostBg} ${AppColors.textPrimary} ${AppColors.buttonGhostHover} hover:${AppColors.textPrimary} focus:ring-slate-500`,
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
