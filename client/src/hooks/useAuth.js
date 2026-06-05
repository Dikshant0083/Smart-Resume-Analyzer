// useAuth lives in AuthContext to avoid circular imports.
// This file re-exports it so both import paths work:
//   import { useAuth } from '@/hooks'
//   import { useAuth } from '@/context'
export { useAuth } from '@/context/AuthContext'
