import { createContext, useState, useEffect } from "react";
import type { AuthContextType, AuthProviderProps } from "../../interfaces/Auth";
import type { UserDataProps } from "../../interfaces/UserData";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initUser = {
	email: "",
	name: "",
	id: 0
};

export function AuthProvider({ children }: AuthProviderProps) {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<UserDataProps>(initUser);

	const isAuth = !!token; // derive auth state

	useEffect(() => {
		const storedToken = localStorage.getItem("token"); // fix key
		const storedUser = localStorage.getItem("user");
		if (storedToken) setToken(storedToken);
		if (storedUser) setUser(JSON.parse(storedUser));
		setIsLoading(false);
	}, []);

	function updateUser(updatedFields: Partial<UserDataProps>) {
		const newUser = { ...user, ...updatedFields };
		localStorage.setItem("user", JSON.stringify(newUser));
		setUser(newUser);
	}

	function login(newToken: string, userData: UserDataProps) {
		localStorage.setItem("token", newToken);
		localStorage.setItem("user", JSON.stringify(userData));
		setToken(newToken);
		setUser(userData);
	}

	function logout() {
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		setToken(null);
		setUser(initUser);
	}

	return (
		<AuthContext.Provider value={{ token, user, updateUser, login, logout, isAuth, isLoading }}>
			{children}
		</AuthContext.Provider>
  );
}