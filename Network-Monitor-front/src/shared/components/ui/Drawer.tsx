import { useEffect } from 'react'
import { X } from 'lucide-react'
import { AppColors } from '../../theme/colors'
import { AppText } from '../../theme/typography'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${AppColors.backdropBg} backdrop-blur-sm transition-opacity`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`relative flex w-full max-w-md flex-col ${AppColors.surfaceBg} shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b ${AppColors.borderSubtle} px-6 py-4`}>
          <h2 className={`${AppText.h2} ${AppColors.textPrimary}`}>{title}</h2>
          <button
            onClick={onClose}
            className={`rounded-full p-2 ${AppColors.textMuted} transition-colors hover:${AppColors.surfaceRaised} hover:${AppColors.textPrimary}`}
            aria-label="Cerrar panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
