import Answer from "./Answer";
import type { Question, Answer } from "../types";

interface QuestionProps {
	question: Question;
}

function Question({ question }: QuestionProps) {
	return (
		<div className="question my-8">
			<h2 className="text-2xl mb-4">{question.question}</h2>
			{question.answers.map((a, index) => (
				<Answer key={index} answer={a} />
			))}
		</div>
	);
}

export default Question;
