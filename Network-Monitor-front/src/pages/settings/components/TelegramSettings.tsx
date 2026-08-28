import { Send, Shield, Bell } from 'lucide-react'
import { AppColors } from '../../../shared/theme/colors'
import { AppText } from '../../../shared/theme/typography'

interface TelegramSettingsProps {
  telegramEnabled: boolean
  setTelegramEnabled: (val: boolean) => void
  botToken: string
  setBotToken: (val: string) => void
  chatId: string
  setChatId: (val: string) => void
  notifyIntruders: boolean
  setNotifyIntruders: (val: boolean) => void
  notifyDisconnections: boolean
  setNotifyDisconnections: (val: boolean) => void
}

export function TelegramSettings({
  telegramEnabled,
  setTelegramEnabled,
  botToken,
  setBotToken,
  chatId,
  setChatId,
  notifyIntruders,
  setNotifyIntruders,
  notifyDisconnections,
  setNotifyDisconnections,
}: TelegramSettingsProps) {
  return (
    <div className={`p-6 rounded-2xl border ${AppColors.cardBorder} ${AppColors.cardBg} space-y-6`}>
      <div className={`flex items-center justify-between pb-4 border-b ${AppColors.borderSubtle}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${AppColors.skyBg} ${AppColors.sky} border ${AppColors.skyBorder}`}>
            <Send size={22} />
          </div>
          <div>
            <h2 className={`${AppText.h2} ${AppColors.textPrimary}`}>
              Notificaciones y Bot de Telegram
            </h2>
            <p className={`${AppText.caption} ${AppColors.textSecondary}`}>
              Alertas en tiempo real ante intrusos o desconcatenaciones
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={telegramEnabled}
            onChange={(e) => setTelegramEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </label>
      </div>

      {telegramEnabled && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`${AppText.label} ${AppColors.textPrimary}`}>
                Bot API Token
              </label>
              <input
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl ${AppColors.inputBg} ${AppColors.inputBorder} border ${AppColors.textPrimary} focus:outline-none ${AppColors.inputFocusRing} focus:ring-2 ${AppText.mono}`}
              />
            </div>

            <div className="space-y-2">
              <label className={`${AppText.label} ${AppColors.textPrimary}`}>
                Chat ID / Canal ID
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl ${AppColors.inputBg} ${AppColors.inputBorder} border ${AppColors.textPrimary} focus:outline-none ${AppColors.inputFocusRing} focus:ring-2 ${AppText.mono}`}
              />
            </div>
          </div>

          {/* Notification Triggers */}
          <div className="space-y-3 pt-2">
            <span className={`${AppText.label} ${AppColors.textPrimary} block mb-2`}>
              Eventos que detonan Alertas:
            </span>

            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${AppColors.cardBorder} ${AppColors.cardBg}`}>
              <div className="flex items-center gap-3">
                <Shield size={18} className={AppColors.amber} />
                <div>
                  <div className={`${AppText.value} ${AppColors.textPrimary}`}>Dispositivo Desconocido (Posible Intruso)</div>
                  <div className={`${AppText.caption} ${AppColors.textSecondary}`}>Avisa si se detecta una dirección MAC no registrada previamente.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyIntruders}
                onChange={(e) => setNotifyIntruders(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${AppColors.cardBorder} ${AppColors.cardBg}`}>
              <div className="flex items-center gap-3">
                <Bell size={18} className={AppColors.error} />
                <div>
                  <div className={`${AppText.value} ${AppColors.textPrimary}`}>Desconexión de Equipo Crítico</div>
                  <div className={`${AppText.caption} ${AppColors.textSecondary}`}>Avisa si un servidor o router deja de responder al ping.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyDisconnections}
                onChange={(e) => setNotifyDisconnections(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
