import {
	createContext,
	ReactNode,
	useCallback,
	useMemo,
	useState,
} from 'react';

type AuthContextType = {
	currentUser: any;
	loginUser: (user: any) => void;
	logoutUser: () => void;
};

export const AuthContext = createContext<AuthContextType>({
	currentUser: null,
	loginUser: (user: any) => {},
	logoutUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
	const [currentUser, setCurrentUser] = useState(null);

	const loginUser = useCallback((response: any) => {
		console.log('Login response:', response);
		setCurrentUser(response);
	}, []);

	const logoutUser = useCallback(() => {
		setCurrentUser(null);
	}, []);

	const contextValue = useMemo(
		() => ({
			currentUser,
			loginUser,
			logoutUser,
		}),
		[currentUser, loginUser, logoutUser]
	);

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
}
