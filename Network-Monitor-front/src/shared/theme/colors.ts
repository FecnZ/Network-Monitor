export const AppColors = {
  // --- Page & Surface ---
  pageBg: 'bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950',
  surfaceBg: 'bg-white dark:bg-slate-900',
  surfaceRaised: 'bg-slate-50 dark:bg-slate-800/50',
  surfaceOverlay: 'bg-white/90 dark:bg-slate-900/50',
  backdropBg: 'bg-slate-900/20 dark:bg-black/60',

  // --- Primary accent ---
  primary: 'text-emerald-600 dark:text-emerald-400',
  primaryBg: 'bg-emerald-50 dark:bg-emerald-500/10',
  primaryBorder: 'border-emerald-200 dark:border-emerald-500/20',
  primaryGradient: 'bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400',

  // --- Success ---
  success: 'text-emerald-600 dark:text-emerald-400',
  successBg: 'bg-emerald-500 dark:bg-emerald-400',
  successGlow: 'shadow-[0_0_6px_rgba(52,211,153,0.1)] dark:shadow-[0_0_6px_rgba(52,211,153,0.2)]',
  successCardBorder: 'border-emerald-200 dark:border-emerald-500/20',
  successCardBg: 'bg-emerald-50 dark:bg-slate-800/60',

  // --- Error ---
  error: 'text-rose-600 dark:text-rose-400',
  errorBg: 'bg-rose-500 dark:bg-rose-400',
  errorGlow: 'shadow-[0_0_10px_rgba(251,113,133,0.2)] dark:shadow-[0_0_10px_rgba(251,113,133,0.5)]',
  errorContainerBg: 'bg-rose-50 dark:bg-rose-500/10',
  errorContainerBorder: 'border-rose-200 dark:border-rose-500/20',

  // --- Text ---
  textPrimary: 'text-slate-900 dark:text-slate-200',
  textHighlight: 'text-indigo-600 dark:text-indigo-300',
  textMuted: 'text-slate-500 dark:text-slate-400',
  textSecondary: 'text-slate-600 dark:text-slate-500',
  textOnPrimary: 'text-white',

  // --- Borders ---
  borderSubtle: 'border-slate-200 dark:border-slate-800',
  borderDefault: 'border-slate-200 dark:border-slate-700/50',
  borderRow: 'border-slate-100 dark:border-slate-700/30',

  // --- Input ---
  inputHoverBg: 'hover:bg-slate-100 dark:hover:bg-slate-700/40',

  // --- Cards ---
  cardBg: 'bg-white dark:bg-slate-800/50',
  cardBgHover: 'hover:bg-slate-50 dark:hover:bg-slate-700/40',
  cardBorder: 'border-slate-200 dark:border-slate-700/50',

  // --- Selection Cards (e.g. Theme, Port Range) ---
  selectableCardBase: 'p-3 rounded-xl text-left border transition-all',
  selectableCardIdle: 'border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700',
  selectableCardActive: 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-white',

  // --- Sub-Cards / Inner items (e.g. Logs, Engine status, History items) ---
  subCardBg: 'bg-slate-50 dark:bg-slate-800/30',
  subCardBorder: 'border-slate-200 dark:border-slate-800',
  subCardHover: 'hover:bg-slate-100/80 dark:hover:bg-slate-700/40 hover:border-slate-300 dark:hover:border-slate-700',

  // --- Buttons ---
  buttonPrimaryBg: 'bg-gradient-to-r from-indigo-500 to-purple-600',
  buttonPrimaryShadow: 'shadow-md shadow-indigo-500/20 dark:shadow-lg dark:shadow-indigo-500/25',
  buttonPrimaryHover: 'hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/40 hover:brightness-110',
  buttonPrimaryRing: 'focus:ring-indigo-500',
  buttonGhostBg: 'bg-slate-100 dark:bg-slate-800/50',
  buttonGhostHover: 'hover:bg-slate-200 dark:hover:bg-slate-700/50',

  // --- Icons ---
  iconBg: 'bg-slate-100 dark:bg-slate-800',
  iconBorder: 'border-slate-200 dark:border-slate-900',
  iconMuted: 'text-slate-400 dark:text-slate-600',

  // --- Input ---
  inputBg: 'bg-white dark:bg-slate-700/50',
  inputBorder: 'border-slate-300 dark:border-slate-600',
  inputRing: 'ring-indigo-500/30 dark:ring-indigo-500/50',
  inputFocusRing: 'focus:ring-indigo-500',

  // --- Indigo accent (DB, ports, backend) ---
  indigo: 'text-indigo-600 dark:text-indigo-400',
  indigoBg: 'bg-indigo-50 dark:bg-indigo-500/10',
  indigoBorder: 'border-indigo-500/20',

  // --- Teal accent (online, secondary metric) ---
  teal: 'text-teal-600 dark:text-teal-400',
  tealBg: 'bg-teal-500/10',
  tealBorder: 'border-teal-500/20',
  tealDot: 'bg-teal-500 dark:bg-teal-400',

  // --- Sky accent (logs, events, charts) ---
  sky: 'text-sky-500 dark:text-sky-400',
  skyBg: 'bg-sky-500/10',
  skyBorder: 'border-sky-500/20',
  skyDot: 'bg-sky-500 dark:bg-sky-400',

  // --- Amber accent (warnings, sun icon) ---
  amber: 'text-amber-500 dark:text-amber-400',
  amberDot: 'bg-amber-500 dark:bg-amber-400',

  // --- Emerald badge / dot (primary accent variants) ---
  primaryBadge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
  primaryActiveBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
  primaryDot: 'bg-emerald-500 dark:bg-emerald-400',
  primaryGlow: 'bg-emerald-500/10 blur-3xl',
  secondaryGlow: 'bg-teal-500/10 blur-2xl',

  // --- Misc ---
  skeletonBg: 'bg-slate-200 dark:bg-slate-700/50',
  timelineLine: 'before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent',
} as const;
