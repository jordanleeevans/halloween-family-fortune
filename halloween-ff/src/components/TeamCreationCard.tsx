import React, { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardFooter,
	CardContent,
	CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GiSlime } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";
import { useGameContext } from "@/context/GameContext";
import { Player } from "@/types";

interface TeamCreationCardProps {
	teamIndex: number;
}

const TeamCreationCard: React.FC<TeamCreationCardProps> = ({ teamIndex }) => {
	const { teams, setTeams } = useGameContext();
	const team = teams[teamIndex];
	const [playerName, setPlayerName] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [newTeamName, setNewTeamName] = useState(team.name);

	const addPlayerToTeam = (player: Player) => {
		const updatedTeams = [...teams];
		updatedTeams[teamIndex].players.push(player);
		setTeams(updatedTeams);
	};

	const removePlayer = (playerIndex: number) => {
		const updatedTeams = [...teams];
		updatedTeams[teamIndex].players.splice(playerIndex, 1);
		setTeams(updatedTeams);
	};

	const changeTeamName = (newName: string) => {
		const updatedTeams = [...teams];
		updatedTeams[teamIndex].name = newName;
		setTeams(updatedTeams);
	};

	const handleAddPlayer = () => {
		if (playerName.trim()) {
			addPlayerToTeam({
				name: playerName,
				score: 0,
				current: false,
			});
			setPlayerName("");
		}
	};

	const handleEditTeamName = () => {
		if (newTeamName.trim()) {
			changeTeamName(newTeamName);
			setIsEditing(false);
		}
	};

	return (
		<Card className="bg-halloweenBlack border-2 border-halloweenOrange text-white shadow-xl mt-4 hover:scale-105 transform transition-transform duration-500">
			<CardHeader className="flex items-center justify-between">
				<TeamName
					teamName={team.name}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					newTeamName={newTeamName}
					setNewTeamName={setNewTeamName}
					handleEditTeamName={handleEditTeamName}
				/>
			</CardHeader>
			<CardContent>
				<PlayerList players={team.players} removePlayer={removePlayer} />
				<div className="flex space-x-2 m-2">
					<Input
						className="w-full"
						type="text"
						placeholder="Add player"
						value={playerName}
						onChange={(e) => setPlayerName(e.target.value)}
					/>
					<Button
						onClick={handleAddPlayer}
						className="bg-halloweenOrange hover:bg-orange-600"
					>
						Add Player
					</Button>
				</div>
			</CardContent>
			<CardFooter className="justify-center text-halloweenOrange">
				Total Players: {team.players.length}
			</CardFooter>
		</Card>
	);
};

interface TeamNameProps {
	teamName: string;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
	newTeamName: string;
	setNewTeamName: (newTeamName: string) => void;
	handleEditTeamName: () => void;
}
const TeamName: React.FC<TeamNameProps> = ({
	teamName,
	isEditing,
	setIsEditing,
	newTeamName,
	setNewTeamName,
	handleEditTeamName,
}) => {
	return (
		<>
			{isEditing ? (
				<div className="flex items-center justify-end space-x-2 animate-in fade-in slide-in-from-right-10 duration-500">
					<Input
						type="text"
						value={newTeamName.replace("Team ", "")}
						onChange={(e) => setNewTeamName(`Team ${e.target.value}`)}
						className="text-white border-halloweenOrange"
					/>
					<Button
						onClick={handleEditTeamName}
						className="bg-halloweenOrange hover:bg-orange-600"
					>
						Save
					</Button>
					<Button
						onClick={() => setIsEditing(false)}
						className="bg-red-500 hover:bg-red-600"
					>
						{" "}
						Cancel{" "}
					</Button>
				</div>
			) : (
				<CardTitle className="text-2xl font-bold text-halloweenOrange text-center flex items-center">
					{teamName}
					<CiEdit
						className="ml-2 cursor-pointer"
						onClick={() => setIsEditing(true)}
					/>
				</CardTitle>
			)}
		</>
	);
};

interface PlayerULProps {
	players: Player[];
	removePlayer: (playerIndex: number) => void;
}

const PlayerList: React.FC<PlayerULProps> = ({ players, removePlayer }) => {
	const [visiblePlayers, setVisiblePlayers] = useState<Player[]>([]);

	useEffect(() => {
		setVisiblePlayers(players);
	}, [players]);

	return (
		<ul className="list-none space-y-2">
			{visiblePlayers.map((player, index) => (
				<li
					key={index}
					className="flex group space-x-2 hover:text-red-500 animate-in fade-in slide-in-from-right-10 duration-500"
				>
					<GiSlime className="text-green-500" />
					<span className="flex-1">{player.name}</span>
					<span
						className="hidden group-hover:inline cursor-pointer animate-in fade-in slide-in-from-right-10 duration-500"
						onClick={() => removePlayer(index)}
					>
						❌
					</span>
				</li>
			))}
		</ul>
	);
};

export default TeamCreationCard;
