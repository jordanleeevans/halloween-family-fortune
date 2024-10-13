import React from "react";
import { useGameContext } from "../context/GameContext";
import TeamCreationCard from "../components/TeamCreationCard";
import { Button } from "../components/ui/button";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
			toast.error("Please add players to both teams to start the game.", {
				duration: 3000,
			});
			return;
		}
		setTeams(teams);
		setCurrentPlayers();

		navigate("/family-fortune");
	};

	return (
		<div className="home">
			<TypeAnimation
				sequence={["Welcome to Halloween Family Feud!\nGet ready to play!"]}
				style={{ whiteSpace: "pre-line", height: "195px" }}
				className="text-4xl text-center text-halloweenOrange"
			/>
			<div className="flex flex-col items-center space-y-4">
				<TeamCreationCard teamIndex={0} />
				<TeamCreationCard teamIndex={1} />
				<Button
					onClick={handleStartGame}
					className="bg-halloweenOrange hover:bg-orange-600"
				>
					Play
				</Button>
			</div>
		</div>
	);
};

export default Home;
