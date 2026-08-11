import type { Device } from '../types/device.types'
import { DeviceStatusBadge } from './DeviceStatusBadge'
import { FriendlyNameCell } from './FriendlyNameCell'
import { formatDate } from '../../../shared/lib/formatDate'

interface Props {
  devices: Device[]
}

export function DeviceCardList({ devices }: Props) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {devices.map((device) => (
        <div
          key={device.id}
          className={`rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300 ${
            device.online
              ? 'border-emerald-500/20 bg-slate-800/60 shadow-lg shadow-emerald-500/5'
              : 'border-slate-700/30 bg-slate-800/40'
          }`}
        >
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-base font-semibold text-indigo-300">
              {device.ipAddress}
            </span>
            <DeviceStatusBadge online={device.online} />
          </div>

          {/* Friendly name */}
          <div className="mb-3">
            <FriendlyNameCell device={device} />
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500">Hostname</span>
              <p className="truncate text-slate-300">
                {device.hostname || '—'}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Vendor</span>
              <p className="truncate text-slate-300">
                {device.vendor ?? '—'}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500">MAC</span>
              <p className="font-mono text-slate-400">
                {device.macAddress ?? '—'}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Primera vez</span>
              <p className="text-slate-400">{formatDate(device.firstSeen)}</p>
            </div>
            <div>
              <span className="text-slate-500">Última vez</span>
              <p className="text-slate-400">{formatDate(device.lastSeen)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
