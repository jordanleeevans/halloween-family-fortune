import { useState, useEffect } from "react";
import Question from "./components/Question";

function App() {
	const [questions, setQuestions] = useState([]);

	useEffect(() => {
		fetch("/data/questions.json")
			.then((response) => response.json())
			.then((data) => setQuestions(data));
	}, []);

	return (
		<div className="App text-center bg-black text-orange-500 font-creepster">
			<h1 className="text-4xl my-8">Halloween Family Fortune</h1>
			{questions.map((q, index) => (
				<Question key={index} question={q} />
			))}
		</div>
	);
}

export default App;
