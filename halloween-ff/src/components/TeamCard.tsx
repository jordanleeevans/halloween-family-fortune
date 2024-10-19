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

	const placeholderPlayers = Array.from({ length: 6 }, (_, index) => ({
		name: `Player ${index + 1}`,
		score: 0,
		current: index === 0 ? true : false,
	}));

	const players = teams[teamIndex].players.length
		? teams[teamIndex].players
		: placeholderPlayers;

	return (
		<Card>
			<CardHeader className="flex justify-between">
				<CardTitle className="text-2xl font-bold text-halloweenOrange mb-2">
					{teams[teamIndex].name}
				</CardTitle>
				<CardContent className="flex flex-col items-center">
					{players.map((player, index) => (
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
			className={`w-full p-4 mb-2 mx-16 text-center rounded-md transition-all duration-300 hover:text-white  ${
				player.current
					? "bg-halloweenGreen text-white hover:bg-green-900 hover:cursor-pointer"
					: "bg-halloweenOrange"
			} ${
				isClicked
					? "animate-float border-2 border-white shadow-white shadow-md "
					: ""
			}`}
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
			<span>{team.players.reduce((acc, player) => acc + player.score, 0)}</span>
		</div>
	);
};

export default TeamCard;
