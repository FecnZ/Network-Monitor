import { useState } from 'react'
import { useUpdateFriendlyName } from '../hooks/useUpdateFriendlyName'
import type { Device } from '../types/device.types'

interface Props {
  device: Device
}

export function FriendlyNameCell({ device }: Props) {
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
        className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-1.5 text-sm text-slate-100 outline-none ring-1 ring-indigo-500/50 transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={cancelEditing}
        placeholder="Nombre..."
      />
    )
  }

  return (
    <div
      onDoubleClick={startEditing}
      className="cursor-pointer rounded-lg px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-slate-100"
      title="Doble clic para editar"
    >
      {device.friendlyName ?? (
        <span className="italic text-slate-500">Sin nombre</span>
      )}
    </div>
  )
}
