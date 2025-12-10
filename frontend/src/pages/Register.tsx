import Form from '../components/Auth/Form';
import '../styles/Auth/Auth.css';

export default function Register() {
	return (
		<div className='auth-page'>
			<div className='auth-form'>
				<div>
					<Form register={true} profile={false} />
				</div>
			</div>
			<div className='auth-screenbar'></div>
		</div>
	);
}
