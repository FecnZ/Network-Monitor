import { Fragment, useState } from 'react'
import type { Device } from '../types/device.types'
import { DeviceStatusBadge } from './DeviceStatusBadge'
import { useUpdateFriendlyName } from '../hooks/useUpdateFriendlyName'
import { History, Pencil, MoreHorizontal, ChevronUp } from 'lucide-react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface Props {
  devices: Device[]
  onViewHistory: (deviceId: number, deviceName?: string) => void
}

function DeviceActionsRow({
  device,
  onViewHistory,
}: {
  device: Device
  onViewHistory: () => void
}) {
  const [name, setName] = useState(device.friendlyName ?? '')
  const mutation = useUpdateFriendlyName()

  function handleSave() {
    if (name.trim() !== (device.friendlyName ?? '')) {
      mutation.mutate({ id: device.id, friendlyName: name.trim() })
    }
  }

  return (
    <tr className={`border-b ${AppColors.borderRow} ${AppColors.surfaceBg}`}>
      <td colSpan={7} className="p-0">
        <div className="px-6 py-6 md:px-12 animate-in slide-in-from-top-2 fade-in duration-200 shadow-inner">
          <div className="flex flex-col md:flex-row md:flex-wrap items-start gap-8">

            {/* Opción 1: Renombrar */}
            <div className="flex flex-col gap-2 flex-1">
              <label className={`${AppText.caption} ${AppColors.textSecondary} flex items-center gap-1.5 uppercase tracking-wider font-semibold`}>
                <Pencil size={12} />
                Nombre del dispositivo
              </label>
              <div className={`flex items-center gap-2 rounded-lg border ${AppColors.inputBorder} ${AppColors.inputBg} p-1 focus-within:ring-2 ${AppColors.inputFocusRing}`}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="Ej. Laptop, Smart TV..."
                  className={`flex-1 bg-transparent px-2 py-1 ${AppText.bodySmall} ${AppColors.textPrimary} outline-none placeholder:${AppColors.iconMuted}`}
                />
                <button
                  onClick={handleSave}
                  disabled={name.trim() === (device.friendlyName ?? '')}
                  className={`rounded-md px-3 py-1 transition-all text-white font-medium ${AppText.caption} ${name.trim() !== (device.friendlyName ?? '')
                    ? `${AppColors.buttonPrimaryBg} hover:brightness-110 shadow-sm`
                    : 'bg-zinc-600/50 cursor-not-allowed opacity-50'
                    }`}
                >
                  Guardar
                </button>
              </div>
            </div>

            {/* Opción 2: Historial */}
            <div className="flex flex-col gap-2">
              <label className={`${AppText.caption} ${AppColors.textSecondary} flex items-center gap-1.5 uppercase tracking-wider font-semibold`}>
                <History size={12} />
                Registro
              </label>
              <button
                onClick={onViewHistory}
                className={`inline-flex items-center gap-3 rounded-lg border ${AppColors.borderDefault} px-4 py-2 hover:${AppColors.cardBgHover} transition-colors group`}
              >
                <span className={`${AppText.bodySmall} ${AppColors.textPrimary} font-medium`}>Ver historial</span>
                <span className={`${AppText.caption} ${AppColors.primary} group-hover:translate-x-0.5 transition-transform`}>→</span>
              </button>
            </div>

            {/* Espacio para Opciones Futuras */}
            <div className="flex flex-col gap-2 opacity-50 flex-1 max-w-sm">
              <label className={`${AppText.caption} ${AppColors.textSecondary} flex items-center gap-1.5 uppercase tracking-wider font-semibold`}>
                <MoreHorizontal size={12} />
                Más opciones
              </label>
              <div className={`w-full flex items-center justify-center rounded-lg border border-dashed ${AppColors.borderDefault} py-2 ${AppColors.textSecondary} ${AppText.caption} cursor-not-allowed`}>
                Próximamente...
              </div>
            </div>

          </div>
        </div>
      </td>
    </tr>
  )
}

export function DeviceTable({ devices, onViewHistory }: Props) {
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null)

  return (
    <div className={`overflow-x-auto rounded-xl border ${AppColors.cardBorder} ${AppColors.cardBg} backdrop-blur-sm`}>
      <table className={`w-full ${AppText.bodySmall}`}>
        <thead>
          <tr className={`border-b ${AppColors.borderRow} text-left`}>
            <th className={`px-4 py-3 ${AppText.caption} ${AppColors.textSecondary}`}>IP</th>
            <th className={`px-4 py-3 ${AppText.caption} ${AppColors.textSecondary}`}>Hostname</th>
            <th className={`px-4 py-3 ${AppText.caption} ${AppColors.textSecondary}`}>Nombre</th>
            <th className={`px-4 py-3 ${AppText.caption} ${AppColors.textSecondary}`}>MAC</th>
            <th className={`px-4 py-3 ${AppText.caption} ${AppColors.textSecondary}`}>Vendor</th>
            <th className={`px-4 py-3 ${AppText.caption} ${AppColors.textSecondary}`}>Estado</th>
            <th className={`w-12 px-3 py-3 ${AppText.caption} ${AppColors.textSecondary} text-right`}></th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => {
            const isExpanded = expandedRowId === device.id
            return (
              <Fragment key={device.id}>
                <tr
                  className={`border-b ${AppColors.borderRow} transition-colors ${isExpanded ? AppColors.surfaceBg : `hover:${AppColors.cardBgHover}`
                    }`}
                >
                  <td className={`px-4 py-2.5 ${AppText.mono} ${AppColors.primary}`}>
                    {device.ipAddress}
                  </td>
                  <td className={`px-4 py-2.5 ${AppColors.textPrimary}`}>{device.hostname}</td>
                  <td className={`px-4 py-2.5 ${AppColors.textMuted}`}>
                    {device.friendlyName ?? <span className={`italic ${AppColors.iconMuted}`}>—</span>}
                  </td>
                  <td className={`px-4 py-2.5 ${AppText.monoSmall} ${AppColors.textMuted}`}>
                    {device.macAddress ?? <span className={AppColors.iconMuted}>—</span>}
                  </td>
                  <td className={`px-4 py-2.5 ${AppColors.textMuted}`}>
                    {device.vendor ?? '—'}
                  </td>
                  <td className="px-4 py-2.5">
                    <DeviceStatusBadge online={device.online} />
                  </td>
                  <td className="w-12 px-3 py-2.5 text-right">
                    <button
                      onClick={() => setExpandedRowId(isExpanded ? null : device.id)}
                      className={`inline-flex items-center justify-center p-1.5 rounded-md transition-colors ${isExpanded
                        ? `${AppColors.primary} ${AppColors.primaryBg}`
                        : `${AppColors.textSecondary} hover:${AppColors.textPrimary} hover:${AppColors.cardBgHover}`
                        }`}
                      title={isExpanded ? "Cerrar opciones" : "Opciones"}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <MoreHorizontal size={16} />}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <DeviceActionsRow
                    device={device}
                    onViewHistory={() => onViewHistory(device.id, device.friendlyName || device.hostname)}
                  />
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
