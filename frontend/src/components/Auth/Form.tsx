import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import type { FormProps, FormData } from "../../interfaces/Form.ts";
import { useAuth } from "../../contexts/auth/useAuth.tsx";
import  "../../styles/auth/Auth.css"

const userDataInit = { name: "", email: "", password: "" };


export interface ValidationMsgProps {
	field: string,
	msg: string
};

export default function Form(props: FormProps) {
	const [ userData, setUserData ] = useState<FormData>(userDataInit);
	const [ validationMsg, setValidationMsg ] = useState<ValidationMsgProps | null>(null);
	const { user, token, updateUser, login } = useAuth();
	const navigate = useNavigate();
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
			const res = await fetch('http://localhost:3001/users/${users.id}/${fieldName}', {
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

	async function handleSubmit(e: any) {
		e.preventDefault();
		if (register) {
			try {
				const res = await fetch("http://localhost:3001/register", {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(userData)
				});
				const data = await res.json();
				if (res.ok && data.token && data.user) {
					setValidationMsg(null);
					login(data.token, data.user);
					// navigate('/home');
					console.log('Registration succeed');
				} else {
					setValidationMsg({
						field: data.field,
						msg: data.error
					});
					console.error('Registration Failed');
				}
			} catch (err) {
				console.error('Registration error: ', err);
			}
		} else {
			try {
				const headers: Record<string, string> = { 'Content-Type': 'application/json'};

				const res = await fetch("http://localhost:3001/login", {
					method: 'POST',
					headers: headers,
					body: JSON.stringify(userData)
				});
				const data = res.json();
				const { token, user } = data;
				if (res.ok && token && user) {
					setValidationMsg(null);
					login(token, user);
					// navigate('/home');
					console.log('Login successful');
				} else {
					setValidationMsg({
						field: data.field,
						msg: data.msg
					});
					console.error('Login Failed');
				}
			} catch (err) {
				console.error('Login error: ', err);
			}
		}
	}
}