import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";

import { db, auth, storage } from "./config/firebase";

import {
	getDocs,
	collection,
	addDoc,
	deleteDoc,
	doc,
	updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
	const [movieList, setMovieList] = useState([]);
	const moviesCollectionRef = collection(db, "movies");

	// New movie states
	const [newMovieTitle, setNewMovieTitle] = useState("");
	const [newReleaseDate, setNewReleaseDate] = useState("");
	const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

	// Update title state
	const [updatedTitle, setUpdatedTitle] = useState("");

	// File Upload State
	const [fileUpload, setFileUpload] = useState(null);

	const getMovieList = async () => {
		try {
			const data = await getDocs(moviesCollectionRef);

			const filteredData = data.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));

			setMovieList(filteredData);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		getMovieList();
	}, []);

	const addNewMovie = async () => {
		try {
			await addDoc(moviesCollectionRef, {
				title: newMovieTitle,
				releaseDate: newReleaseDate,
				receivedAnOscar: isNewMovieOscar,
				userId: auth?.currentUser.uid ?? "unkown",
			});
			getMovieList();
		} catch (err) {
			console.error(err);
		}
	};

	const deleteMovie = async (id, userId) => {
		if (!auth.currentUser || auth.currentUser.uid !== userId) {
			alert("You are not authorized to delete this movie.");
			return;
		}
		const movieDoc = doc(db, "movies", id);
		await deleteDoc(movieDoc);
		getMovieList();
	};

	const updateMovieTitle = async (id, userId) => {
		if (!auth.currentUser || auth.currentUser.uid !== userId) {
			alert("You are not authorized to edit this movie.");
			return;
		}
		const movieDoc = doc(db, "movies", id);
		await updateDoc(movieDoc, {
			title: updatedTitle,
		});
		getMovieList();
	};

	const uploadFile = async () => {
		if (!fileUpload) return;
		try {
			const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
			await uploadBytes(filesFolderRef, fileUpload);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="App">
			<Auth />
			<div>
				<input
					placeholder="Movie title..."
					onChange={(e) => setNewMovieTitle(e.target.value)}
				/>
				<input
					placeholder="Release date..."
					type="number"
					onChange={(e) => setNewReleaseDate(Number(e.target.value))}
				/>
				<input
					name="oscar"
					id="oscar"
					type="checkbox"
					checked={isNewMovieOscar}
					onChange={(e) => setIsNewMovieOscar(e.target.checked)}
				/>
				<label htmlFor="oscar">Recieved an Oscar</label>
				<button onClick={addNewMovie}>Submit Movie</button>
			</div>
			<div>
				{movieList.map((movie) => (
					<div key={movie.title}>
						<h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
							{movie.title}
						</h1>
						<p>Date: {movie.releaseDate}</p>
						<button onClick={() => deleteMovie(movie.id, movie.userId)}>
							Delete Movie
						</button>

						<input
							placeholder="New title..."
							onChange={(e) => setUpdatedTitle(e.target.value)}
						></input>
						<button onClick={() => updateMovieTitle(movie.id, movie.userId)}>
							Update Title
						</button>
					</div>
				))}
			</div>
			<div>
				<input
					type="file"
					name="file"
					id="file"
					onChange={(e) => setFileUpload(e.target.files[0])}
				/>
				<button onClick={uploadFile}>Submit File</button>
			</div>
		</div>
	);
}

export default App;
