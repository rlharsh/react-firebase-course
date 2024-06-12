import { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
	createUserWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from "firebase/auth";

export const Auth = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(undefined);

	const signIn = async () => {
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			setUser(auth.currentUser);
		} catch (err) {
			console.error(err);
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			await signInWithPopup(auth, googleProvider);
			setUser(auth.currentUser);
		} catch (err) {
			console.error(err);
		}
	};

	const logOut = async () => {
		try {
			await signOut(auth);
			setUser(undefined);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			{!user && (
				<>
					<input placeholder="Email..." onChange={(e) => setEmail(e.target.value)} />
					<input placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
					<button onClick={signIn}>Sign In</button>
					<button onClick={handleGoogleSignIn}>Sign in with Google</button>
				</>
			)}
			{user && (
				<>
					{user.photoURL && (
						<>
							<img src={user.photoURL} alt="" />
							<br />
						</>
					)}
				</>
			)}
			<button onClick={logOut}>Logout</button>
		</div>
	);
};
