import React from "react";
import { useGameContext } from "../context/GameContext";
import TeamCreationCard from "../components/TeamCreationCard";
import { Button } from "../components/ui/button";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";
import { enqueueToast } from "@/lib/utils";

const Home: React.FC = () => {
	const { teams, setTeams } = useGameContext();
	const navigate = useNavigate();

	const clearCurrentPlayers = () => {
		const updatedTeams = teams.map((team) => ({
			...team,
			players: team.players.map((player) => ({
				...player,
				current: false,
			})),
		}));
		setTeams(updatedTeams);
	};

	const setCurrentPlayers = () => {
		clearCurrentPlayers();
		const updatedTeams = teams.map((team) => {
			const randomIndex = Math.floor(Math.random() * team.players.length);
			return {
				...team,
				players: team.players.map((player, index) => ({
					...player,
					current: index === randomIndex,
				})),
			};
		});
		setTeams(updatedTeams);
	};

	const handleStartGame = () => {
		if (teams[0].players.length === 0 || teams[1].players.length === 0) {
			enqueueToast(
				"Please add players to both teams to start the game.",
				"error",
				3000
			);
			return;
		}

		// check no two players have the same name
		const playerNames = teams.flatMap((team) =>
			team.players.map((player) => player.name)
		);
		const uniquePlayerNames = new Set(playerNames);
		if (playerNames.length !== uniquePlayerNames.size) {
			enqueueToast("Each player must have a unique name", "error", 3000);
			return;
		}

		setTeams(teams);
		setCurrentPlayers();

		navigate("/family-fortune");
	};

	return (
		<div className="home">
			<TypeAnimation
				sequence={["Welcome to Halloween Family Fortune!\nGet ready to play!"]}
				style={{ whiteSpace: "pre-line", height: "195px" }}
				className="text-4xl text-center text-halloweenOrange"
			/>
			<div className="flex flex-col items-center space-y-4">
				<TeamCreationCard teamIndex={0} />
				<TeamCreationCard teamIndex={1} />
				<Button
					onClick={handleStartGame}
					className="bg-halloweenOrange hover:bg-orange-600 border border-white shadow-lg hover:shadow-xl"
				>
					Play
				</Button>
			</div>
		</div>
	);
};

export default Home;
