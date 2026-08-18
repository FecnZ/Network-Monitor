export const AppColors = {
  // --- Page & Surface ---
  pageBg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
  surfaceBg: 'bg-slate-900',
  surfaceRaised: 'bg-slate-800/50',
  surfaceOverlay: 'bg-slate-900/50',
  backdropBg: 'bg-black/60',

  // --- Primary accent ---
  primary: 'text-emerald-400',
  primaryBg: 'bg-emerald-500/10',
  primaryBorder: 'border-emerald-500/20',
  primaryGradient: 'bg-gradient-to-r from-emerald-400 to-teal-400',

  // --- Success ---
  success: 'text-emerald-400',
  successBg: 'bg-emerald-400',
  successGlow: 'shadow-[0_0_6px_rgba(52,211,153,0.2)]',
  successCardBorder: 'border-emerald-500/20',
  successCardBg: 'bg-slate-800/60',

  // --- Error ---
  error: 'text-rose-400',
  errorBg: 'bg-rose-400',
  errorGlow: 'shadow-[0_0_10px_rgba(251,113,133,0.5)]',
  errorContainerBg: 'bg-rose-500/10',
  errorContainerBorder: 'border-rose-500/20',

  // --- Text ---
  textPrimary: 'text-slate-200',
  textHighlight: 'text-indigo-300',
  textMuted: 'text-slate-400',
  textSecondary: 'text-slate-500',
  textOnPrimary: 'text-white',

  // --- Borders ---
  borderSubtle: 'border-slate-800',
  borderDefault: 'border-slate-700/50',
  borderRow: 'border-slate-700/30',

  // --- Input ---
  inputHoverBg: 'hover:bg-slate-700/40',

  // --- Cards ---
  cardBg: 'bg-slate-800/50',
  cardBgHover: 'hover:bg-slate-700/40',
  cardBorder: 'border-slate-700/50',

  // --- Buttons ---
  buttonPrimaryBg: 'bg-gradient-to-r from-indigo-500 to-purple-600',
  buttonPrimaryShadow: 'shadow-lg shadow-indigo-500/25',
  buttonPrimaryHover: 'hover:shadow-indigo-500/40 hover:brightness-110',
  buttonPrimaryRing: 'focus:ring-indigo-500',
  buttonGhostBg: 'bg-slate-800/50',
  buttonGhostHover: 'hover:bg-slate-700/50',

  // --- Icons ---
  iconBg: 'bg-slate-800',
  iconBorder: 'border-slate-900',
  iconMuted: 'text-slate-600',

  // --- Input ---
  inputBg: 'bg-slate-700/50',
  inputBorder: 'border-slate-600',
  inputRing: 'ring-indigo-500/50',
  inputFocusRing: 'focus:ring-indigo-500',

  // --- Misc ---
  skeletonBg: 'bg-slate-700/50',
  timelineLine: 'before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent',
} as const;
