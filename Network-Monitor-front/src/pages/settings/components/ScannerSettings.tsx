import { Terminal } from 'lucide-react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface ScannerSettingsProps {
  subnet: string
  setSubnet: (val: string) => void
  scanSpeed: string
  setScanSpeed: (val: string) => void
  portRange: string
  setPortRange: (val: string) => void
}

export function ScannerSettings({
  subnet,
  setSubnet,
  scanSpeed,
  setScanSpeed,
  portRange,
  setPortRange,
}: ScannerSettingsProps) {
  return (
    <div className={`p-6 rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} space-y-6`}>
      <div className={`flex items-center gap-3 pb-4 border-b ${AppColors.borderSubtle}`}>
        <div className={`p-2.5 rounded-xl ${AppColors.tealBg} ${AppColors.teal} border ${AppColors.tealBorder}`}>
          <Terminal size={22} />
        </div>
        <div>
          <h2 className={`${AppText.h2} ${AppColors.textPrimary}`}>
            Parámetros de Escaneo Nmap
          </h2>
          <p className={`${AppText.caption} ${AppColors.textSecondary}`}>
            Configuración del adaptador `com.networkmonitor.scanner`
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subnet Input */}
        <div className="space-y-2">
          <label className={`${AppText.label} ${AppColors.textPrimary}`}>
            Subred por Defecto (CIDR)
          </label>
          <input
            type="text"
            value={subnet}
            onChange={(e) => setSubnet(e.target.value)}
            placeholder="192.168.1.0/24"
            className={`w-full px-4 py-2.5 rounded-xl ${AppColors.inputBg} ${AppColors.inputBorder} border ${AppColors.textPrimary} focus:outline-none ${AppColors.inputFocusRing} focus:ring-2 ${AppText.mono}`}
          />
          <span className={`${AppText.caption} ${AppColors.textSecondary} block`}>
            Rango de IPs objetivo para el descubrimiento automático de la LAN.
          </span>
        </div>

        {/* Aggressiveness Speed (-T) */}
        <div className="space-y-2">
          <label className={`${AppText.label} ${AppColors.textPrimary}`}>
            Velocidad de Nmap (Timing -T)
          </label>
          <select
            value={scanSpeed}
            onChange={(e) => setScanSpeed(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl ${AppColors.inputBg} ${AppColors.inputBorder} border ${AppColors.textPrimary} focus:outline-none ${AppColors.inputFocusRing} focus:ring-2 ${AppText.bodySmall}`}
          >
            <option value="T2">T2 - Sigiloso / Lento</option>
            <option value="T3">T3 - Normal (Balanceado)</option>
            <option value="T4">T4 - Rápido (Recomendado)</option>
            <option value="T5">T5 - Agresivo (Muy rápido)</option>
          </select>
          <span className={`${AppText.caption} ${AppColors.textSecondary} block`}>
            Controla la agresividad y el timeout de respuesta durante el escaneo.
          </span>
        </div>

        {/* Port Range Selection */}
        <div className="space-y-2 md:col-span-2">
          <label className={`${AppText.label} ${AppColors.textPrimary}`}>
            Rango de Puertos a Inspeccionar
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'common', title: 'Puertos Comunes (Top 100)', desc: 'HTTP, SSH, FTP, RDP, DBs' },
              { id: 'fast', title: 'Escaneo Rápido (Top 20)', desc: 'Solo servicios críticos' },
              { id: 'full', title: 'Completo (1 - 65535)', desc: 'Exhaustivo (Tarda más)' },
            ].map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => setPortRange(option.id)}
                className={`${AppColors.selectableCardBase} p-4 ${
                  portRange === option.id
                    ? AppColors.selectableCardActive
                    : AppColors.selectableCardIdle
                }`}
              >
                <div className={`${AppText.value} mb-1`}>{option.title}</div>
                <div className={`${AppText.caption} ${portRange === option.id ? 'opacity-80' : AppColors.textSecondary}`}>{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
