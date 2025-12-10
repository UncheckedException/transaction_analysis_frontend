export function toCurrency(val) {
if (val == null) return '-'
return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}


export function formatDateISO(ts) {
if (!ts) return ''
const d = new Date(ts)
return d.toISOString().slice(0,19)
}