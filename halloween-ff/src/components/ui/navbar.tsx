import React from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineTrophy } from "react-icons/ai";

const GameTitle: React.FC = () => {
	return (
		<div className="flex text-2xl font-bold text-halloweenOrange">
			Halloween Family Fortune
		</div>
	);
};

const ScoreBoardButton: React.FC<{
	setShowScoreboard: (show: boolean) => void;
}> = ({ setShowScoreboard }) => {
	return (
		<Button
			className="bg-halloweenOrange text-white hover:bg-orange-600"
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
	return (
		<div className="w-full text-halloweenOrange p-4 flex justify-between items-center shadow-xl rounded-bl-lg rounded-br-lg sticky mb-8 bg-gradient-to-b from-halloweenBlack to-black/30 animate-in fade-in slide-in-from-top-10 duration-500">
			<GameTitle />
			<ScoreBoardButton setShowScoreboard={setShowScoreboard} />
		</div>
	);
};

export default Navbar;
