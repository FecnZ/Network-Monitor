import { useState } from 'react'
import { Save, CheckCircle2 } from 'lucide-react'
import { AppColors } from '../../shared/theme/colors'
import { AppText } from '../../shared/theme/typography'
import { useTheme } from '../../shared/theme/useTheme'

// Subcomponents
import { AppearanceSettings } from './components/AppearanceSettings'
import { ScannerSettings } from './components/ScannerSettings'
import { SchedulerSettings } from './components/SchedulerSettings'
import { TelegramSettings } from './components/TelegramSettings'
import { DatabaseSettings } from './components/DatabaseSettings'

export function SettingsPage() {
  // Theme State
  const { theme, setTheme } = useTheme()

  // State for Settings
  const [subnet, setSubnet] = useState('192.168.1.0/24')
  const [scanSpeed, setScanSpeed] = useState('T4')
  const [portRange, setPortRange] = useState('common')
  const [autoScanInterval, setAutoScanInterval] = useState('60')
  const [telegramEnabled, setTelegramEnabled] = useState(true)
  const [botToken, setBotToken] = useState('781920391:AAEv_ExampleTokenPlaceholder')
  const [chatId, setChatId] = useState('123456789')
  const [notifyIntruders, setNotifyIntruders] = useState(true)
  const [notifyDisconnections, setNotifyDisconnections] = useState(false)
  const [dbEngine, setDbEngine] = useState('H2')
  const [historyRetentionDays, setHistoryRetentionDays] = useState('30')
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`${AppText.h1} ${AppColors.textPrimary}`}>
            Configuración del Sistema
          </h1>
          <p className={`mt-0.5 ${AppText.caption} ${AppColors.textSecondary}`}>
            Administra el motor de escaneo Nmap, la frecuencia de tareas programadas y las alertas por Telegram.
          </p>
        </div>

        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl ${AppText.buttonText} transition-all duration-200 ${AppColors.buttonPrimaryBg} ${AppColors.buttonPrimaryShadow} ${AppColors.buttonPrimaryHover} ${AppColors.textOnPrimary}`}
        >
          {savedSuccess ? <CheckCircle2 size={18} className={AppColors.success} /> : <Save size={18} />}
          <span>{savedSuccess ? '¡Guardado!' : 'Guardar Ajustes'}</span>
        </button>
      </header>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className={`p-4 rounded-xl ${AppColors.primaryBg} border ${AppColors.primaryBorder} ${AppColors.primary} ${AppText.bodySmall} flex items-center gap-3`}>
          <CheckCircle2 size={20} />
          <span>Preferencias guardadas exitosamente en la configuración de la aplicación.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <AppearanceSettings theme={theme} setTheme={setTheme} />
        
        <ScannerSettings 
          subnet={subnet} setSubnet={setSubnet}
          scanSpeed={scanSpeed} setScanSpeed={setScanSpeed}
          portRange={portRange} setPortRange={setPortRange}
        />
        
        <SchedulerSettings 
          autoScanInterval={autoScanInterval} 
          setAutoScanInterval={setAutoScanInterval} 
        />
        
        <TelegramSettings 
          telegramEnabled={telegramEnabled} setTelegramEnabled={setTelegramEnabled}
          botToken={botToken} setBotToken={setBotToken}
          chatId={chatId} setChatId={setChatId}
          notifyIntruders={notifyIntruders} setNotifyIntruders={setNotifyIntruders}
          notifyDisconnections={notifyDisconnections} setNotifyDisconnections={setNotifyDisconnections}
        />
        
        <DatabaseSettings 
          dbEngine={dbEngine} setDbEngine={setDbEngine}
          historyRetentionDays={historyRetentionDays} setHistoryRetentionDays={setHistoryRetentionDays}
        />
      </form>
    </div>
  )
}
