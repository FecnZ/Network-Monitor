import { Outlet, NavLink } from 'react-router-dom'
import { Home, Server, Settings } from 'lucide-react'
import { AppColors } from '../../shared/theme/colors'
import { AppText } from '../../shared/theme/typography'

const NAV_ITEMS = [
  { path: '/', label: 'Inicio', icon: Home },
  { path: '/devices', label: 'Dispositivos', icon: Server },
  { path: '/settings', label: 'Config.', icon: Settings },
]

export function MainLayout() {
  return (
    <div className={`min-h-screen ${AppColors.pageBg} flex flex-col md:flex-row pb-16 md:pb-0`}>
      {/* Sidebar Desktop */}
      <aside className={`hidden md:flex flex-col w-64 border-r ${AppColors.borderSubtle} ${AppColors.surfaceBg} p-4`}>
        <div className="mb-8 px-2 mt-4">
          <h2 className={`${AppText.h2} ${AppColors.textPrimary}`}>
            <span className={`${AppColors.primaryGradient} bg-clip-text text-transparent`}>
              Net
            </span>{' '}
            Monitor
          </h2>
        </div>
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? `${AppColors.primaryGradient} text-white font-medium shadow-md shadow-emerald-500/20`
                    : `${AppColors.textSecondary} hover:${AppColors.textPrimary} ${AppColors.cardBgHover}`
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t ${AppColors.borderSubtle} ${AppColors.surfaceBg} flex justify-around items-center h-16 px-2 z-50`}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-20 h-full gap-1 transition-colors ${
                isActive
                  ? AppColors.primary
                  : `${AppColors.textSecondary} hover:${AppColors.textPrimary}`
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={24} className={isActive ? 'drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]' : ''} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
