import Form from '../components/Auth/Form.tsx';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import '../styles/auth/Auth.css'

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