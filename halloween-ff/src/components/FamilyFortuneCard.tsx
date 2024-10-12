import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Tile from "@/components/ui/tile";
import { useGameContext } from "@/context/GameContext";
import { useState } from "react";

export default function FamilyFortuneCard() {
	const teamIndex = 0; //TODO: Replace with the index of the current team
	const [input, setInput] = useState("");
	const {
		currentRoundIndex,
		currentRound,
		cardMessage: message,
		handleSubmit,
	} = useGameContext();
	return (
		<div className="flex items-center justify-center min-h-screen">
			<Card className="w-full max-w-md bg-halloweenBlack border-2 border-halloweenOrange text-white shadow-xl">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-halloweenOrange text-center">
						Round {currentRoundIndex}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<h2 className="text-xl mb-4 text-center">{currentRound.question}</h2>
					<div className="space-y-2 mb-4">
						{currentRound.answers.map((answer, index) => (
							<Tile key={index} answer={answer} />
						))}
					</div>
					<form
						onSubmit={(e) => {
							handleSubmit(e, input, teamIndex);
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
							className="bg-gray-700 text-white border-halloweenOrange"
						/>
						<Button
							type="submit"
							className="bg-halloweenOrange hover:bg-orange-600"
						>
							Submit
						</Button>
					</form>
					{message && <p className="text-center text-orange-300">{message}</p>}
				</CardContent>
			</Card>
		</div>
	);
}
