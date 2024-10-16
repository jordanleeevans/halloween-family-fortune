import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/context/GameContext";
import { Player } from "@/types";

type ScoreboardProps = {
	isVisible: boolean;
};

const Scoreboard: React.FC<ScoreboardProps> = ({ isVisible }) => {
	const { teams } = useGameContext();
	const players = teams.flatMap((team) => team.players);
	const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

	return (
		<Card
			className={`absolute max-w-g mx-auto mt-8 z-50  shadow-md shadow-white py-3 px-4 wave ${
				isVisible
					? "animate-in slide-in-from-left-full opacity-90 animate-float"
					: "opacity-0"
			}`}
		>
			<CardTitle className="text-2xl font-bold text-center">
				Player Scoreboard
			</CardTitle>
			<CardContent className="p-4">
				<ul>
					{sortedPlayers.map((player, index) => {
						if (index === 0) {
							return <FirstPlaceLI key={index} {...player} />;
						} else if (index === 1) {
							return <SecondPlaceLI key={index} {...player} />;
						} else if (index === 2) {
							return <ThirdPlaceLI key={index} {...player} />;
						} else {
							return (
								<li
									key={index}
									className="flex justify-between py-2 border-separate border-b-2 border-halloweenPurple"
								>
									<span className="text-lg font-medium">{player.name}</span>
									<span className="text-lg font-medium">{player.score}</span>
								</li>
							);
						}
					})}
				</ul>
			</CardContent>
		</Card>
	);
};

const FirstPlaceLI: React.FC<Player> = (player) => {
	return (
		<li className="flex justify-between py-2 border-separate border-b-2 border-halloweenPurple">
			<span className="text-lg font-medium">🏆 {player.name}</span>
			<span className="text-lg font-medium">{player.score}</span>
		</li>
	);
};

const SecondPlaceLI: React.FC<Player> = (player) => {
	return (
		<li className="flex justify-between py-2 border-separate border-b-2 border-halloweenPurple">
			<span className="text-lg font-medium">🥈 {player.name}</span>
			<span className="text-lg font-medium">{player.score}</span>
		</li>
	);
};

const ThirdPlaceLI: React.FC<Player> = (player) => {
	return (
		<li className="flex justify-between py-2 border-separate border-b-2 border-halloweenPurple">
			<span className="text-lg font-medium">🥉 {player.name}</span>
			<span className="text-lg font-medium">{player.score}</span>
		</li>
	);
};

export default Scoreboard;
