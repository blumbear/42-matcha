import { StrictMode } from 'react'
import { AuthProvider } from './contexts/auth/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AuthProvider>
		</AuthProvider>
	</StrictMode>
)