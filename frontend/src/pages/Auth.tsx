import Form from '../components/auth/Form';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '../styles/auth/Auth.css'

// clientID within .env as a varname !!!
export default function Login() {
	return (
		<div className='auth-page'>
			<div className='auth-form'>
				<Form register={false} profile={false} />
			</div>
			<div className='auth-screenbar'></div>
		</div>
	)
}