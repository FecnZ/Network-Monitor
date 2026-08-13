import { Badge } from '../../../shared/components/ui/Badge'

interface Props {
  online: boolean
}

export function DeviceStatusBadge({ online }: Props) {
  return (
    <Badge variant={online ? 'success' : 'danger'}>
      {online ? 'Online' : 'Offline'}
    </Badge>
  )
}
