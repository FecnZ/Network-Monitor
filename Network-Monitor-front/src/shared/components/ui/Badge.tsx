import type { ReactNode } from 'react'

interface Props {
  variant: 'success' | 'danger' | 'neutral'
  children: ReactNode
}

const variants = {
  success: 'bg-emerald-500/15 text-emerald-400 shadow-emerald-500/20',
  danger: 'bg-rose-500/15 text-rose-400 shadow-rose-500/20',
  neutral: 'bg-slate-500/15 text-slate-400 shadow-slate-500/10',
}

export function Badge({ variant, children }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm ${variants[variant]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          variant === 'success'
            ? 'bg-emerald-400 animate-pulse'
            : variant === 'danger'
              ? 'bg-rose-400'
              : 'bg-slate-400'
        }`}
      />
      {children}
    </span>
  )
}
