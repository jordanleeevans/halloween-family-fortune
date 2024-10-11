interface AnswerProps {
	answer: {
		answer: string;
		points: number;
	};
}

function Answer({ answer }: AnswerProps) {
	return (
		<div className="answer flex justify-between my-2">
			<span>{answer.answer}</span>
			<span>{answer.points} points</span>
		</div>
	);
}

export default Answer;
