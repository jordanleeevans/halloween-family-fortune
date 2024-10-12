import { useState, useCallback } from "react";
import fuzzysort from "fuzzysort";
import { Answer } from "@/types";

type InitialAnswer = Answer & { revealed: boolean };

const useRoundLogic = (initialAnswers: InitialAnswer[]) => {
	const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
	const [input, setInput] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = useCallback(
		(e?: React.FormEvent) => {
			if (e) e.preventDefault();
			const results = fuzzysort.go(input, answers, { key: "text" });
			if (results.length > 0 && results[0].score > -5000) {
				const matchedIndex = answers.findIndex(
					(a) => a.text === results[0].obj.text
				);
				if (matchedIndex !== -1 && !answers[matchedIndex].revealed) {
					setAnswers((prev) =>
						prev.map((a, i) =>
							i === matchedIndex ? { ...a, revealed: true } : a
						)
					);
					setMessage(`You found "${results[0].obj.text}"!`);
				} else {
					setMessage("This answer has already been revealed!");
				}
			} else {
				setMessage("No match found. Try again!");
			}
			setInput("");
		},
		[input, answers]
	);

	return { answers, input, message, setInput, handleSubmit };
};

export default useRoundLogic;
