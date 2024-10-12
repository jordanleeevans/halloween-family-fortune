import React from "react";
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
	const { nextRound, teams } = useGameContext();

	return (
		<div className="w-full bg-halloweenBlack text-halloweenOrange p-4 flex justify-between items-center shadow-xl rounded-bl-lg rounded-br-lg fixed">
			<div className="flex space-x-4">
				{teams.map((team, index) => (
					<div key={index} className="flex flex-col items-center">
						<span className="font-bold">{team.name}</span>
						<span>{team.score} points</span>
					</div>
				))}
			</div>
			<div className="flex text-2xl font-bold text-halloweenOrange">
				Halloween Family Fortune
			</div>
			<div>
				<Button
					onClick={nextRound}
					className="bg-halloweenOrange hover:bg-orange-600"
				>
					Next Round
				</Button>
			</div>
		</div>
	);
};

export default Navbar;
