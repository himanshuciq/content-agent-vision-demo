// Mike's buttons share one box: height, border, radius, type. Only the fill says which one leads.
const BUTTON = "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-md border px-5 text-[15px] font-semibold shadow-xs transition-colors"

export const PRIMARY = `${BUTTON} border-brand-500 bg-brand-500 text-white hover:border-brand-600 hover:bg-brand-600`
export const SECONDARY = `${BUTTON} border-slate-200 bg-white text-slate-950 hover:border-brand-300 hover:text-brand-700`
