import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Tile from "@/components/ui/tile";
import { useGameContext } from "@/context/GameContext";
import { useState, useEffect } from "react";

export default function FamilyFortuneCard() {
	const [input, setInput] = useState<string>("");
	const { currentRoundIndex, currentRound, handleBuzzerWinnerSubmission } =
		useGameContext();
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-halloweenOrange text-center">
					Round {currentRoundIndex + 1}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Title />
				<div className="space-y-2 mb-4">
					{currentRound.answers.map((answer, index) => (
						<Tile key={index} answer={answer} />
					))}
				</div>
				<form
					onSubmit={(e) => {
						handleBuzzerWinnerSubmission(e, input);
						setInput("");
					}}
					className="flex space-x-2 mb-4"
				>
					<Input
						type="text"
						placeholder="Enter your guess"
						value={input}
						onChange={(e) => {
							setInput(e.target.value);
						}}
						className="bg-gray-700 text-white text-center border-halloweenOrange"
					/>
					<Button
						type="submit"
						className="bg-halloweenOrange hover:bg-orange-600"
					>
						Submit
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

const Title: React.FC = () => {
	const { currentRound } = useGameContext();
	const [isQuestionRevealed, setIsQuestionRevealed] = useState<boolean>(false);
	const handleRevealQuestion = () => {
		setIsQuestionRevealed(true);
	};

	useEffect(() => {
		document.addEventListener("keydown", (e) => {
			if (e.key === " " && document.activeElement?.tagName !== "INPUT") {
				setIsQuestionRevealed(!isQuestionRevealed);
			}
		});
	}, [isQuestionRevealed]);

	return (
		<div className="relative">
			<h2
				className={`text-xl mb-4 text-center transition-opacity duration-500 rounded-md ${
					isQuestionRevealed ? "opacity-100" : "opacity-0"
				}`}
			>
				{currentRound.question}
			</h2>
			{!isQuestionRevealed && (
				<div
					className="absolute inset-0 bg-gray-900 flex items-center justify-center cursor-pointer rounded-sm animate-float border-gray-700 border-2 shadow-gray-800 shadow-md"
					onClick={handleRevealQuestion}
				>
					<span className="text-white text-xl">Click to Reveal</span>
				</div>
			)}
		</div>
	);
};
