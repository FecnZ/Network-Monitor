import { useEffect, useState } from 'react'
import { useDevices } from './hooks/useDevices'
import { useScanStatus } from './hooks/useScanStatus'
import { useTriggerScan } from './hooks/useTriggerScan'
import { useUpdateFriendlyName } from './hooks/useUpdateFriendlyName'
import type { Device } from './types/device'

function FriendlyNameCell({ device }: { device: Device }) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(device.friendlyName ?? '')
  const mutation = useUpdateFriendlyName()

  function startEditing() {
    setValue(device.friendlyName ?? '')
    setIsEditing(true)
  }

  function cancelEditing() {
    setValue(device.friendlyName ?? '')
    setIsEditing(false)
  }

  function confirmChange() {
    if (value !== device.friendlyName) {
      mutation.mutate({ id: device.id, friendlyName: value })
    }
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      confirmChange()
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  if (isEditing) {
    return (
      <input
        autoFocus
        className="border rounded px-2 py-1 text-sm w-full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={cancelEditing}
      />
    )
  }

  return (
    <div
      onDoubleClick={startEditing}
      className="cursor-pointer text-sm px-2 py-1 rounded hover:bg-gray-100"
      title="Doble clic para editar"
    >
      {device.friendlyName ?? <span className="text-gray-400 italic">Sin nombre</span>}
    </div>
  )
}

function App() {
  const { data: devices, isLoading, isError, error } = useDevices()
  const scanMutation = useTriggerScan()
  const [isPolling, setIsPolling] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasConfirmedStart, setHasConfirmedStart] = useState(false)
  const { data: scanStatus } = useScanStatus(isPolling)

  // Cuando el POST responde OK, empieza a consultar el estado
  function handleScanClick() {
    setIsSubmitting(true)
    setHasConfirmedStart(false) // reseteamos al iniciar un nuevo ciclo
    scanMutation.mutate(undefined, {
    onSuccess: () => setIsPolling(true),
    onSettled: () => setIsSubmitting(false),
  })
  }

  // Cuando el backend confirma que ya terminó, deja de consultar

useEffect(() => {
  if (!isPolling) return

  if (scanStatus?.inProgress === true) {
    setHasConfirmedStart(true) // confirmamos que ya vimos el escaneo activo de verdad
  }

  if (hasConfirmedStart && scanStatus?.inProgress === false) {
    setIsPolling(false) // solo ahora sí confiamos en que terminó
  }
}, [scanStatus, isPolling, hasConfirmedStart])

const isScanning = isSubmitting || isPolling

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Network Monitor</h1>
      <button
          onClick={handleScanClick}
          disabled={isScanning}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow disabled:bg-gray-400"
        >
          {isScanning ? 'Escaneando...' : 'Escanear ahora'}
        </button>
      </div>

      {scanMutation.isError && (
        <p className="text-red-600 mb-4">
          Error al iniciar el escaneo: {(scanMutation.error as Error).message}
        </p>
      )}

      {isLoading && <p className="text-gray-500">Cargando dispositivos...</p>}

      {isError && (
        <p className="text-red-600">
          Error al cargar dispositivos: {(error as Error).message}
        </p>
      )}

      {devices && (
        <table className="w-full bg-white rounded shadow text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">IP</th>
              <th className="p-3">Hostname</th>
              <th className="p-3">Friendly Name</th>
              <th className="p-3">MAC</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id} className="border-b">
                <td className="p-3">{device.ipAddress}</td>
                <td className="p-3">{device.hostname}</td>
                <td className="p-3">
                  <FriendlyNameCell device={device} />
                </td>
                <td className="p-3">{device.macAddress ?? 'Sin MAC'}</td>
                <td className="p-3">{device.vendor ?? '—'}</td>
                <td className="p-3">
                  <span
                    className={
                      device.online
                        ? 'text-green-600 font-medium'
                        : 'text-gray-400'
                    }
                  >
                    {device.online ? 'Online' : 'Offline'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}


export default App