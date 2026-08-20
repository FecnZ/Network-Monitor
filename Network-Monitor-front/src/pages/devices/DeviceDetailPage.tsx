import { useParams, useNavigate } from 'react-router-dom'
import { useDevices } from '../../features/devices/hooks/useDevices'
import { useDeviceHistory } from '../../features/devices/hooks/useDeviceHistory'
import { AppColors } from '../../shared/theme/colors'
import { AppText } from '../../shared/theme/typography'
import { ArrowLeft, Activity, GitCommitVertical, List } from 'lucide-react'
import { Skeleton } from '../../shared/components/ui/Skeleton'
import { useState, useRef, useEffect } from 'react'
import { DeviceDetailsSidebar } from './components/DeviceDetailsSidebar'
import { HistoryFilterPopover } from './components/HistoryFilterPopover'
import { DeviceHistoryTimeline } from './components/DeviceHistoryTimeline'
import { DeviceHistoryTable } from './components/DeviceHistoryTable'

export function DeviceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const deviceId = id ? parseInt(id, 10) : null

  const { data: devices } = useDevices()
  const device = devices?.find((d) => d.id === deviceId)

  const { data: history, isLoading: historyLoading } = useDeviceHistory(deviceId)

  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterPopoverRef = useRef<HTMLDivElement>(null)

  // Filter state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [eventStatusFilter, setEventStatusFilter] = useState('all')
  const [timePreset, setTimePreset] = useState('all')

  const resetHistoryFilters = () => {
    setStartDate('')
    setEndDate('')
    setEventStatusFilter('all')
    setTimePreset('all')
  }

  const hasActiveFilters = Boolean(startDate || endDate || eventStatusFilter !== 'all' || timePreset !== 'all')

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isFilterOpen])

  return (
    <div className="flex flex-col gap-6 pb-8 h-full">

      {/* Navigation Header */}
      <header className={`flex items-center gap-4 border-b ${AppColors.borderSubtle} pb-4`}>
        <button
          onClick={() => navigate('/devices')}
          className={`flex items-center justify-center p-2 rounded-xl transition-all ${AppColors.cardBg} ${AppColors.cardBorder} border hover:${AppColors.textPrimary} ${AppColors.textSecondary}`}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className={`${AppText.h1} ${AppColors.textPrimary}`}>
            {device?.friendlyName || device?.hostname || device?.ipAddress || 'Cargando dispositivo...'}
          </h1>
          {device?.friendlyName && (
            <p className={`mt-0.5 ${AppText.monoSmall} ${AppColors.primary}`}>
              {device.ipAddress}
            </p>
          )}
        </div>
      </header>

      {/* Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Device Details */}
        <div className="lg:col-span-1 space-y-6">
          <DeviceDetailsSidebar device={device} />
        </div>

        {/* Right Column: History Panel */}
        <div className="lg:col-span-2">
          <div className={`p-6 rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} space-y-4 h-full relative`}>

            {/* History Header & Controls */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${AppColors.borderSubtle}`}>
              <div className="flex items-center gap-3">
                <Activity className={AppColors.primary} size={20} />
                <h2 className={`${AppText.h2} ${AppColors.textPrimary}`}>Historial de Conexiones</h2>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto relative" ref={filterPopoverRef}>
                {/* Filter Popover */}
                <HistoryFilterPopover
                  isOpen={isFilterOpen}
                  onToggle={() => setIsFilterOpen((prev) => !prev)}
                  onClose={() => setIsFilterOpen(false)}
                  hasActiveFilters={hasActiveFilters}
                  startDate={startDate}
                  endDate={endDate}
                  eventStatusFilter={eventStatusFilter}
                  timePreset={timePreset}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  onEventStatusChange={setEventStatusFilter}
                  onTimePresetChange={setTimePreset}
                  onReset={resetHistoryFilters}
                />

                {/* View Toggle */}
                <div className={`flex ${AppColors.subCardBg} p-1 rounded-lg border ${AppColors.borderSubtle}`}>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'timeline' ? `bg-white ${AppColors.textPrimary} shadow-sm` : `${AppColors.textSecondary} hover:${AppColors.textPrimary}`}`}
                    title="Vista Timeline"
                  >
                    <GitCommitVertical size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? `bg-white ${AppColors.textPrimary} shadow-sm` : `${AppColors.textSecondary} hover:${AppColors.textPrimary}`}`}
                    title="Vista de Lista"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading Skeletons */}
            {historyLoading && (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            )}

            {/* History Views */}
            {!historyLoading && history && viewMode === 'timeline' && (
              <DeviceHistoryTimeline history={history} />
            )}
            {!historyLoading && history && viewMode === 'list' && (
              <DeviceHistoryTable history={history} />
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
