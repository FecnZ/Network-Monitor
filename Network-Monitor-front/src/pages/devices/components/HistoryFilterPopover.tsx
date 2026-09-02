import { Filter, RotateCcw, X } from 'lucide-react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface HistoryFilterPopoverProps {
  isOpen: boolean
  onToggle: () => void
  hasActiveFilters: boolean
  startDate: string
  endDate: string
  eventStatusFilter: string
  timePreset: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onEventStatusChange: (value: string) => void
  onTimePresetChange: (value: string) => void
  onReset: () => void
  onClose: () => void
}

export function HistoryFilterPopover({
  isOpen,
  onToggle,
  hasActiveFilters,
  startDate,
  endDate,
  eventStatusFilter,
  timePreset,
  onStartDateChange,
  onEndDateChange,
  onEventStatusChange,
  onTimePresetChange,
  onReset,
  onClose,
}: HistoryFilterPopoverProps) {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${AppText.caption} font-medium border transition-colors ${
          hasActiveFilters
            ? AppColors.primaryActiveBg
            : `${AppColors.subCardBg} ${AppColors.subCardBorder} ${AppColors.textSecondary} hover:${AppColors.textPrimary}`
        }`}
        title="Filtrar por fecha o evento"
      >
        <Filter size={14} />
        <span>Filtrar</span>
        {hasActiveFilters && <span className={`w-1.5 h-1.5 rounded-full ${AppColors.primaryDot}`} />}
      </button>

      {/* Floating Dropdown */}
      {isOpen && (
        <div
          className={`absolute right-0 top-10 z-30 w-72 p-4 rounded-xl ${AppColors.surfaceBg} border ${AppColors.borderDefault} shadow-2xl space-y-3 animate-in fade-in duration-150`}
        >
          <div className={`flex items-center justify-between border-b ${AppColors.borderSubtle} pb-2`}>
            <span className={`${AppText.caption} font-semibold ${AppColors.textPrimary}`}>Filtros de Historial</span>
            <button onClick={onClose} className={`${AppColors.textSecondary} hover:${AppColors.textPrimary} p-0.5`}>
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`${AppText.caption} ${AppColors.textSecondary} block mb-1`}>Desde</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className={`w-full px-2 py-1 rounded-md ${AppText.caption} ${AppColors.inputBg} border ${AppColors.inputBorder} ${AppColors.textPrimary}`}
                />
              </div>
              <div>
                <label className={`${AppText.caption} ${AppColors.textSecondary} block mb-1`}>Hasta</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className={`w-full px-2 py-1 rounded-md ${AppText.caption} ${AppColors.inputBg} border ${AppColors.inputBorder} ${AppColors.textPrimary}`}
                />
              </div>
            </div>

            <div>
              <label className={`${AppText.caption} ${AppColors.textSecondary} block mb-1`}>Evento</label>
              <select
                value={eventStatusFilter}
                onChange={(e) => onEventStatusChange(e.target.value)}
                className={`w-full px-2 py-1 rounded-md ${AppText.caption} ${AppColors.inputBg} border ${AppColors.inputBorder} ${AppColors.textPrimary}`}
              >
                <option value="all">Todos los Eventos</option>
                <option value="connected">Conexiones</option>
                <option value="disconnected">Desconexiones</option>
              </select>
            </div>

            <div className="pt-1">
              <label className={`${AppText.caption} ${AppColors.textSecondary} block mb-1`}>Lapsos rápidos</label>
              <div className="flex gap-1.5">
                {[
                  { id: 'today', label: 'Hoy' },
                  { id: '7d', label: '7 días' },
                  { id: '30d', label: '30 días' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onTimePresetChange(preset.id)}
                    className={`flex-1 py-1 rounded ${AppText.caption} border transition-colors ${
                      timePreset === preset.id
                        ? `${AppColors.primaryActiveBg} font-medium`
                        : `${AppColors.subCardBg} ${AppColors.subCardBorder} ${AppColors.textSecondary} hover:${AppColors.textPrimary}`
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className={`w-full py-1 ${AppText.caption} ${AppColors.textSecondary} hover:${AppColors.textPrimary} flex items-center justify-center gap-1 border-t ${AppColors.borderSubtle} pt-2 transition-colors`}
            >
              <RotateCcw size={11} />
              Limpiar Filtros
            </button>
          )}
        </div>
      )}
    </>
  )
}
