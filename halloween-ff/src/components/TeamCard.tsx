import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { useGameContext } from "@/context/GameContext";
import { Player, Team } from "@/types";

interface TeamCardProps {
	teamIndex: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ teamIndex }) => {
	const { teams, setTeamTurn, buzzerPlayer, setBuzzerPlayer } =
		useGameContext();

	const handlePlayerClick = (index: number) => {
		setTeamTurn(teamIndex);
		setBuzzerPlayer(teamIndex, index);
	};

	return (
		<Card className="bg-halloweenBlack border-2 border-halloweenOrange text-white shadow-xl">
			<CardHeader className="flex justify-between">
				<CardTitle className="text-2xl font-bold text-halloweenOrange mb-2">
					{teams[teamIndex].name}
				</CardTitle>
				<CardContent className="flex flex-col items-center">
					{teams[teamIndex].players.map((player, index) => (
						<PlayerTile
							key={index}
							player={player}
							isClicked={
								teamIndex === buzzerPlayer.teamIndex &&
								index === buzzerPlayer.playerIndex
							}
							onClick={() => {
								handlePlayerClick(index);
							}}
						/>
					))}
					<ScoreTile team={teams[teamIndex]} />
				</CardContent>
			</CardHeader>
		</Card>
	);
};

interface PlayerTileProps {
	player: Player;
	isClicked: boolean;
	onClick: () => void;
}

const PlayerTile: React.FC<PlayerTileProps> = ({
	player,
	isClicked,
	onClick,
}) => {
	return (
		<div
			className={`w-full p-4 mb-2 mx-16 text-center rounded-md transition-all duration-300 hover:bg-halloweenOrange hover:text-white hover:cursor-pointer ${
				player.current
					? "bg-halloweenGreen text-white hover:bg-green-800"
					: "bg-halloweenOrange"
			} ${isClicked ? "animate-float" : ""}`}
			onClick={onClick}
		>
			<div className="flex justify-between items-center">
				<div className="flex items-center">
					<div>{player.name}</div>
				</div>
				<div className="text-sm">{player.score} points</div>
			</div>
		</div>
	);
};

const ScoreTile: React.FC<{ team: Team }> = ({ team }) => {
	return (
		<div className="flex flex-col items-center text-2xl text-red-500 mt-4">
			<span>{team.score}</span>
		</div>
	);
};

export default TeamCard;
