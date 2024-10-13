import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Tile from "@/components/ui/tile";
import { useGameContext } from "@/context/GameContext";
import { useState } from "react";

export default function FamilyFortuneCard() {
	const [input, setInput] = useState("");
	const { currentRoundIndex, currentRound, handleSubmit } = useGameContext();
	return (
		<Card className="bg-halloweenBlack border-2 border-halloweenOrange text-white shadow-xl hover:scale-105 transition-transform duration-500">
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
						handleSubmit(e, input);
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
