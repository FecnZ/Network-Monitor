import { Cpu, RefreshCw, HardDrive } from 'lucide-react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

export function BackendStatusCard() {
  return (
    <div className={`p-6 rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} space-y-4`}>
      <div className="flex items-center justify-between">
        <h2 className={`${AppText.h2} ${AppColors.textPrimary} flex items-center gap-2`}>
          <Cpu className={AppColors.indigo} size={20} />
          Motor y Arquitectura Backend
        </h2>
        <span className={`px-2 py-0.5 rounded ${AppText.monoSmall} font-medium ${AppColors.primaryBadge}`}>
          SPRING BOOT 3
        </span>
      </div>

      <p className={`${AppText.caption} ${AppColors.textSecondary}`}>
        Servicios desacoplados según el Blueprint del Proyecto (Nmap Engine + JPA).
      </p>

      <div className="space-y-3 pt-2">
        <div className={`flex items-center justify-between p-3 rounded-xl border ${AppColors.subCardBg} ${AppColors.subCardBorder} hover:${AppColors.subCardHover} transition-colors`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${AppColors.primaryBg} ${AppColors.primary}`}>
              <RefreshCw size={16} />
            </div>
            <div>
              <div className={`${AppText.value} ${AppColors.textPrimary}`}>Motor Nmap (CLI Adapter)</div>
              <div className={`${AppText.caption} ${AppColors.textSecondary}`}>com.networkmonitor.scanner</div>
            </div>
          </div>
          <span className={`${AppText.monoSmall} font-semibold ${AppColors.primary}`}>OK</span>
        </div>

        <div className={`flex items-center justify-between p-3 rounded-xl border ${AppColors.subCardBg} ${AppColors.subCardBorder} hover:${AppColors.subCardHover} transition-colors`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${AppColors.indigoBg} ${AppColors.indigo}`}>
              <HardDrive size={16} />
            </div>
            <div>
              <div className={`${AppText.value} ${AppColors.textPrimary}`}>Base de Datos (H2 / PostgreSQL)</div>
              <div className={`${AppText.caption} ${AppColors.textSecondary}`}>com.networkmonitor.model</div>
            </div>
          </div>
          <span className={`${AppText.monoSmall} font-semibold ${AppColors.indigo}`}>CONECTADO</span>
        </div>
      </div>
    </div>
  )
}
