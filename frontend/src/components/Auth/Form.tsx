import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router";
import type { FormProps, FormData } from "../../interfaces/Form.ts";
import { useAuth } from "../../contexts/auth/useAuth.tsx";

const userDataInit = { name: "", email: "", password: "" };


export interface ValidationMsgProps {
	field: string,
	msg: string
};

export default function Form(props: FormProps) {
	const [ userData, setUserData ] = useState<FormData>(userDataInit);
	const [ validationMsg, setValidationMsg ] = useState<ValidationMsgProps | null>(null);
	const { login, updateUser, user } = useAuth();
	// const navigate = useNavigate();
	const { register, profile } = props;

	async function handleClick(fieldName: string) {
		const value = userData[fieldName as keyof FormData];
		if (!value || value.length === 0) {
			setValidationMsg({
				field: fieldName,
				msg: "INVALID EMPTY FIELD"
			});
			return ;
		}
		try {
			const res = await fetch(`http://localhost:3001/users/${user.id}/${fieldName}`, {
				method: 'PUT',
				headers: {'Content-type': 'application/json'},
				body: JSON.stringify({ [fieldName]: value })
			});
			const data = await res.json();
			if (res.ok) {
				setValidationMsg(null);
				if (fieldName !== 'password')
					updateUser({ [fieldName]: data[fieldName] });
				console.log('Updated succeed');
			} else {
				setValidationMsg({
					field: fieldName,
					msg: data.error
				});
				console.error('Updated Failed');
			}
		} catch (err) {
			console.error('Updated error: ', err);
		}
	}

	function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
		const { name, value } = e.target;
		setUserData(( prev: FormData ) => ( {...prev, [name]: value } ));
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (register) {
			try {
					const res = await fetch("http://localhost:3001/register", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(userData),
					});
					const data = await res.json(); // await the Promise
					if (res.ok && data.token && data.user) {
						setValidationMsg(null);
						login(data.token, data.user);
						console.log("Registration succeed");
					} else {
						setValidationMsg({
								field: data.field ?? "form",
								msg: data.error ?? "Registration failed",
						});
						console.error("Registration Failed");
					}
			} catch (err) {
					console.error("Registration error: ", err);
			}
		} else {
			try {
					const res = await fetch("http://localhost:3001/login", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(userData),
					});
					const data = await res.json(); // await
					const { token, user } = data;
					if (res.ok && token && user) {
						setValidationMsg(null);
						login(token, user);
						console.log("Login successful");
					} else {
						setValidationMsg({
								field: data.field ?? "form",
								msg: data.error ?? "Login failed",
						});
						console.error("Login Failed");
					}
			} catch (err) {
					console.error("Login error: ", err);
			}
		}
}
	return (
		<>
			<form onSubmit={handleSubmit} className={profile ? "form-profile" : "form"}>
				{/* Pseudo / Username field */}
				<div className='name-input'>
					<label htmlFor='name' className={profile ? "profile-label" : ""}>
						Pseudo
					</label>
					<div className="in-line">
						<input
							type='text'
							id='name'
							name='name'
							className={profile ? "profile-input" : ""}
							onChange={handleInputChange}
							value={userData.name}
							placeholder="Votre pseudo"
							required
							autoComplete='off'
						/>
						{profile && (
							<button type="button" className="profile-btn" onClick={() => handleClick('name')}></button>
						)}
					</div>
					{validationMsg && validationMsg.field === "name" && (
						<div className="field">
							<span className="field-msg">{validationMsg.msg}</span>
						</div>
					)}
				</div>

				{/* Email field */}
				{register &&
					<div className='email-input'>
						<label
							htmlFor='email'
							className={profile ? "profile-label" : ""}
						>
							Register
						</label>
						<div className="in-line">
							<input
								type='email'
								id='email'
								name='email'
								className={profile ? "profile-input" : ""}
								onChange={handleInputChange}
								value={userData.email}
								placeholder="..."
								required
								autoComplete='off'
							/>
							{
								profile &&
								<button type="button" className="profile-btn" onClick={() => handleClick('email')}>
								</button>
							}
						</div>
						{
							validationMsg && validationMsg.field === "email" &&
							<div className="field">
								<span className="field-msg">{validationMsg.msg}</span>
							</div>
						}
					</div>
				}

				{/* Password field */}
				<div className='pwd-input'>
					<label
						htmlFor="password"
						className={profile ? "profile-label" : ""}
					>
						Password
					</label>
					<div className="in-line">
						<input
							type="password"
							id="password"
							name="password"
							className={profile ? "profile-input" : ""}
							onChange={handleInputChange}
							value={userData.password}
							placeholder="..."
							required
							autoComplete='off'
							minLength={8}
							// pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
							// title="Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long."
						/>
						{
							profile &&
							<button type="button" className="profile-btn" onClick={() => handleClick('password')} >
							</button>
						}
					</div>
					{
						validationMsg && validationMsg.field === "password" &&
						<div className="field">
							<span className="field-msg">{validationMsg.msg}</span>
						</div>
					}
				</div>

				{!profile && (
					register ? (
						<>
							<Link to='/home' className='link'>Register</Link>
							<Link to='/login' className='link'>Go to Login</Link>
						</>
					) : (
						<>
							<Link to='/home' className='link'>Login</Link>
							<Link to='/register' className='link'>Create an account</Link>
						</>
					)
				)}
			</form>
		</>
	)
}