import { useState } from 'react'
import { DevicesFeature } from '../../features/devices'
import { ScanFeature } from '../../features/scan'
import { AppColors } from '../../shared/theme/colors'
import { AppText } from '../../shared/theme/typography'
import { Search, Filter, SlidersHorizontal, RefreshCcw } from 'lucide-react'

export function DevicesPage() {
  // State for draft filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vendorFilter, setVendorFilter] = useState('all')

  const resetFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setVendorFilter('all')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`${AppText.h1} ${AppColors.textPrimary}`}>
            Dispositivos
          </h1>
          <p className={`mt-0.5 ${AppText.caption} ${AppColors.textSecondary}`}>
            Monitoreo e inventario de dispositivos en tu red local
          </p>
        </div>
        <ScanFeature />
      </header>

      {/* Filter Toolbar (Draft / UI Placeholder) */}
      <div className={`p-4 rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} space-y-3`}>
        <div className="flex items-center justify-between">
          <span className={`${AppText.caption} ${AppColors.primary} font-medium flex items-center gap-1.5`}>
            <SlidersHorizontal size={14} />
            Filtros de Búsqueda (Borrador UI)
          </span>
          {(searchQuery || statusFilter !== 'all' || vendorFilter !== 'all') && (
            <button
              onClick={resetFilters}
              className={`${AppText.caption} ${AppColors.textSecondary} hover:${AppColors.textPrimary} flex items-center gap-1 transition-colors`}
            >
              <RefreshCcw size={12} />
              Limpiar
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative flex items-center">
            <Search size={16} className={`absolute left-3 ${AppColors.textSecondary}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por IP, Hostname, MAC o Fabricante..."
              className={`w-full pl-9 pr-4 py-2 rounded-xl ${AppText.caption} ${AppColors.inputBg} ${AppColors.inputBorder} border ${AppColors.textPrimary} focus:outline-none ${AppColors.inputFocusRing} focus:ring-2`}
            />
          </div>

          {/* Status Filter */}
          <div className="relative flex items-center">
            <Filter size={14} className={`absolute left-3 ${AppColors.textSecondary}`} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl ${AppText.caption} ${AppColors.inputBg} ${AppColors.inputBorder} border ${AppColors.textPrimary} focus:outline-none ${AppColors.inputFocusRing} focus:ring-2`}
            >
              <option value="all">Todos los Estados</option>
              <option value="online">En línea</option>
              <option value="offline">Desconectados</option>
            </select>
          </div>

          {/* Vendor Filter */}
          <div className="relative flex items-center">
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl ${AppText.caption} ${AppColors.inputBg} ${AppColors.inputBorder} border ${AppColors.textPrimary} focus:outline-none ${AppColors.inputFocusRing} focus:ring-2`}
            >
              <option value="all">Todos los Fabricantes</option>
              <option value="apple">Apple Inc.</option>
              <option value="raspberry">Raspberry Pi Foundation</option>
              <option value="tplink">TP-Link</option>
              <option value="intel">Intel Corp.</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main>
        <DevicesFeature />
      </main>
    </div>
  )
}
