import { createContext, useContext } from 'react'

export const CmsContext = createContext(null)

export const useCms = () => useContext(CmsContext)
