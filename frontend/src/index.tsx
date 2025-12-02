import { StrictMode } from 'react'
import { AuthProvider } from './contexts/auth/AuthContext.tsx'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import router from './routes/Router.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>
)