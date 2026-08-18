import { useState } from 'react'
import type { Device } from '../types/device.types'
import { DeviceStatusBadge } from './DeviceStatusBadge'
import { useUpdateFriendlyName } from '../hooks/useUpdateFriendlyName'
import { formatDate } from '../../../shared/lib/formatDate'
import { History, Pencil, X, Check, MoreHorizontal } from 'lucide-react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface Props {
  devices: Device[]
  onViewHistory: (deviceId: number, deviceName?: string) => void
}

function RenameDeviceModal({
  device,
  onClose,
}: {
  device: Device
  onClose: () => void
}) {
  const [name, setName] = useState(device.friendlyName ?? '')
  const mutation = useUpdateFriendlyName()

  function handleSave() {
    if (name.trim() !== (device.friendlyName ?? '')) {
      mutation.mutate({ id: device.id, friendlyName: name.trim() })
    }
    onClose()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSave()
    else if (e.key === 'Escape') onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 ${AppColors.backdropBg} backdrop-blur-sm transition-opacity`}
        onClick={onClose}
      />
      <div className={`relative w-full max-w-sm rounded-2xl border ${AppColors.borderDefault} ${AppColors.surfaceBg} p-5 shadow-2xl backdrop-blur-xl`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${AppColors.primaryBg} ${AppColors.primary}`}>
              <Pencil size={14} />
            </div>
            <h3 className={`${AppText.h3} ${AppColors.textPrimary}`}>
              Nombre del dispositivo
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`rounded-md p-1 ${AppColors.textSecondary} hover:${AppColors.textPrimary} hover:${AppColors.cardBgHover} transition-colors`}
          >
            <X size={16} />
          </button>
        </div>

        <p className={`mb-3 ${AppText.caption} ${AppColors.textSecondary}`}>
          Personaliza cómo identificar a <span className={AppColors.primary}>{device.ipAddress}</span> en tu red.
        </p>

        <div className={`flex items-center gap-2 rounded-xl border ${AppColors.inputBorder} ${AppColors.inputBg} px-3 py-2 focus-within:ring-2 ${AppColors.inputFocusRing} mb-4`}>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ej. Laptop, Smart TV, Celular..."
            className={`w-full bg-transparent ${AppText.bodySmall} ${AppColors.textPrimary} outline-none placeholder:${AppColors.iconMuted}`}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className={`rounded-xl px-3.5 py-2 ${AppText.caption} font-medium ${AppColors.textSecondary} hover:${AppColors.textPrimary} hover:${AppColors.cardBgHover} transition-colors`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-1.5 rounded-xl ${AppColors.buttonPrimaryBg} px-4 py-2 ${AppText.caption} font-medium text-white shadow-md hover:brightness-110 transition-all`}
          >
            <Check size={13} />
            <span>Guardar</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function DeviceCardItem({
  device,
  onViewHistory,
  onRename,
}: {
  device: Device
  onViewHistory: (id: number, name?: string) => void
  onRename: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        device.online
          ? `${AppColors.successCardBorder} ${AppColors.successCardBg}`
          : `${AppColors.cardBorder} ${AppColors.cardBg}`
      } ${open ? AppColors.primaryBorder : ''}`}
    >
      {/* Main card row */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
          onClick={() => setOpen((v) => !v)}
        >
          {/* Status dot */}
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${device.online ? AppColors.successBg : 'bg-slate-600'}`} />
          <div className="min-w-0">
            <p className={`${AppText.mono} ${AppColors.primary} leading-tight`}>{device.ipAddress}</p>
            {device.friendlyName && (
              <p className={`${AppText.caption} ${AppColors.textSecondary} leading-tight truncate`}>{device.friendlyName}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <DeviceStatusBadge online={device.online} />
          <button
            onClick={() => setOpen((v) => !v)}
            className={`p-1.5 rounded-md transition-colors ${
              open
                ? `${AppColors.primary} ${AppColors.primaryBg}`
                : `${AppColors.textSecondary} hover:${AppColors.textPrimary} ${AppColors.cardBgHover}`
            }`}
            title="Detalles y opciones"
            aria-label={`Opciones de ${device.hostname || device.ipAddress}`}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Expanded info + actions */}
      {open && (
        <div className={`border-t ${AppColors.primaryBorder} ${AppColors.primaryBg}`}>
          {/* Device details */}
          <div className={`px-4 py-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 ${AppText.caption}`}>
            <div>
              <span className={AppColors.textSecondary}>Hostname</span>
              <p className={`truncate ${AppColors.textPrimary}`}>{device.hostname || '—'}</p>
            </div>
            <div>
              <span className={AppColors.textSecondary}>Vendor</span>
              <p className={`truncate ${AppColors.textMuted}`}>{device.vendor ?? '—'}</p>
            </div>
            <div className="col-span-2">
              <span className={AppColors.textSecondary}>MAC</span>
              <p className={`${AppText.monoSmall} ${AppColors.textMuted}`}>{device.macAddress ?? '—'}</p>
            </div>
            <div>
              <span className={AppColors.textSecondary}>Primera vez</span>
              <p className={AppColors.textMuted}>{formatDate(device.firstSeen)}</p>
            </div>
            <div>
              <span className={AppColors.textSecondary}>Última vez</span>
              <p className={AppColors.textMuted}>{formatDate(device.lastSeen)}</p>
            </div>
          </div>

          {/* Actions toolbar */}
          <div className={`px-4 py-2 border-t ${AppColors.borderRow} flex items-center justify-end gap-2`}>
            <button
              onClick={onRename}
              className={`inline-flex items-center gap-1.5 rounded-md border ${AppColors.borderDefault} ${AppColors.surfaceRaised} px-2.5 py-1 ${AppText.caption} font-medium ${AppColors.textPrimary} hover:${AppColors.cardBgHover} transition-colors`}
            >
              <Pencil size={12} className={AppColors.primary} />
              <span>{device.friendlyName ? 'Modificar nombre' : 'Asignar nombre'}</span>
            </button>
            <button
              onClick={() => onViewHistory(device.id, device.friendlyName || device.hostname)}
              className={`inline-flex items-center gap-1.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 ${AppText.caption} font-medium text-indigo-300 hover:bg-indigo-500/30 transition-colors`}
            >
              <History size={12} />
              <span>Historial</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function DeviceCardList({ devices, onViewHistory }: Props) {
  const [renameTarget, setRenameTarget] = useState<Device | null>(null)

  return (
    <>
      <div className="flex flex-col gap-1.5">
        {devices.map((device) => (
          <DeviceCardItem
            key={device.id}
            device={device}
            onViewHistory={onViewHistory}
            onRename={() => setRenameTarget(device)}
          />
        ))}
      </div>

      {renameTarget && (
        <RenameDeviceModal
          device={renameTarget}
          onClose={() => setRenameTarget(null)}
        />
      )}
    </>
  )
}
