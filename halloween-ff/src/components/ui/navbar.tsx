import React from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineTrophy } from "react-icons/ai";
import { useGameContext } from "@/context/GameContext";

const GameTitle: React.FC = () => {
	return (
		<div className="flex">
			<h1 className="text-4xl font-bold ">
				<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-halloweenOrange">
					Halloween Family Fortune
				</span>
			</h1>
		</div>
	);
};

const ScoreBoardButton: React.FC<{
	setShowScoreboard: (show: boolean) => void;
}> = ({ setShowScoreboard }) => {
	return (
		<Button
			className="bg-halloweenOrange text-white hover:bg-orange-600 animate-in fade-in"
			onClick={() => setShowScoreboard(true)}
		>
			Player Scoreboard{" "}
			<AiOutlineTrophy className="text-xl pl-1 inline-block" />
		</Button>
	);
};

interface NavbarProps {
	setShowScoreboard: (show: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setShowScoreboard }) => {
	const { teams } = useGameContext();
	const allPlayers = teams.flatMap((team) => team.players);
	const totalScore = allPlayers.reduce((acc, team) => acc + team.score, 0);
	return (
		<div className="w-full text-halloweenOrange p-4 flex justify-between items-center shadow-xl rounded-bl-lg rounded-br-lg sticky mb-8 bg-gradient-to-b from-halloweenBlack to-black/30 animate-in fade-in slide-in-from-top-10 duration-500">
			<GameTitle />
			{totalScore > 0 && (
				<ScoreBoardButton setShowScoreboard={setShowScoreboard} />
			)}
		</div>
	);
};

export default Navbar;
