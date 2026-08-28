import type { Device } from '../types/device.types'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface Props {
  device: Device
}

/** Read-only display of the device's friendly name. Editing is handled via the device action panel. */
export function FriendlyNameCell({ device }: Props) {
  return device.friendlyName ? (
    <span className={`${AppText.bodySmall} ${AppColors.textPrimary}`}>{device.friendlyName}</span>
  ) : (
    <span className={`italic ${AppText.bodySmall} ${AppColors.iconMuted}`}>—</span>
  )
}
