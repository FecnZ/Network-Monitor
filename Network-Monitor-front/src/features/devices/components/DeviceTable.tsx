import type { Device } from '../types/device.types'
import { DeviceStatusBadge } from './DeviceStatusBadge'
import { FriendlyNameCell } from './FriendlyNameCell'

interface Props {
  devices: Device[]
}

export function DeviceTable({ devices }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-xl backdrop-blur-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700/50 text-left">
            <th className="px-4 py-3.5 font-semibold text-slate-300">IP</th>
            <th className="px-4 py-3.5 font-semibold text-slate-300">Hostname</th>
            <th className="px-4 py-3.5 font-semibold text-slate-300">Nombre</th>
            <th className="px-4 py-3.5 font-semibold text-slate-300">MAC</th>
            <th className="px-4 py-3.5 font-semibold text-slate-300">Vendor</th>
            <th className="px-4 py-3.5 font-semibold text-slate-300">Estado</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr
              key={device.id}
              className="border-b border-slate-700/30 transition-colors hover:bg-slate-700/20"
            >
              <td className="px-4 py-3 font-mono text-sm text-indigo-300">
                {device.ipAddress}
              </td>
              <td className="px-4 py-3 text-slate-300">{device.hostname}</td>
              <td className="px-4 py-3">
                <FriendlyNameCell device={device} />
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">
                {device.macAddress ?? (
                  <span className="text-slate-600">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-400">
                {device.vendor ?? '—'}
              </td>
              <td className="px-4 py-3">
                <DeviceStatusBadge online={device.online} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
