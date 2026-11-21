// Panelin yayın API'si. Site anahtarı gizli değildir; yalnız yayındaki içeriği okur (wmp 11-delivery).
export const CMS_API = (import.meta.env?.VITE_WMP_API ?? 'https://wmp-panel-api.onrender.com/api/v1').replace(/\/$/, '')
export const CMS_SITE_KEY = import.meta.env?.VITE_WMP_SITE_KEY ?? 'pk_OwX14GFLS_aHzOiN'
