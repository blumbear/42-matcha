import Form from '../components/Auth/Form.tsx';
import '../styles/Auth/Auth.css';

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