import React, { useEffect, useState } from "react";
import { useGameContext } from "@/context/GameContext";

const GameTitle: React.FC = () => {
	return (
		<div className="flex text-2xl font-bold text-halloweenOrange">
			Halloween Family Fortune
		</div>
	);
};

const ScoreBoard: React.FC = () => {
	const { teams } = useGameContext();
	const [prevTeams, setPrevTeams] = useState(teams);

	useEffect(() => {
		if (JSON.stringify(prevTeams) !== JSON.stringify(teams)) {
			const scoreBoard = document.querySelector(".score-board");
			if (scoreBoard) {
				scoreBoard.classList.add("animate-change");
				setTimeout(() => {
					scoreBoard.classList.remove("animate-change");
				}, 1000);
			}
			setPrevTeams(teams);
		}
	}, [teams, prevTeams]);

	return (
		<div className="score-board flex space-x-4">
			{teams.map((team, index) => (
				<div key={index} className="flex flex-col items-center animate-change">
					<span className="font-bold">{team.name}</span>
					<span>{team.score} points</span>
				</div>
			))}
		</div>
	);
};

const Navbar: React.FC = () => {
	return (
		<div className="w-full text-halloweenOrange p-4 flex justify-between items-center shadow-xl rounded-bl-lg rounded-br-lg sticky mb-8 bg-gradient-to-b from-halloweenBlack to-black/30">
			<GameTitle />
			<ScoreBoard />
		</div>
	);
};

export default Navbar;
