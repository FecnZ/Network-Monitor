import { DevicesFeature } from '../features/devices'
import { ScanFeature } from '../features/scan'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 md:text-3xl">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Network
            </span>{' '}
            Monitor
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitoreo de dispositivos en tu red local
          </p>
        </div>
        <ScanFeature />
      </header>

      {/* Main content */}
      <main>
        <DevicesFeature />
      </main>
    </div>
  )
}
