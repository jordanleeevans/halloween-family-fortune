import React, { useEffect, useState } from "react";
import { GameProvider } from "../context/GameContext";
import Navbar from "../components/ui/navbar";
import gameData from "../data/gameData.json";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Scoreboard from "@/components/Scoreboard";
import JumpScare from "@/components/JumpScare";
import usePlaySoundOnMount from "@/hooks/usePlaySoundOnMount";

const Layout: React.FC = () => {
	const teamNames = ["Team Spooky", "Team Creepy"];
	const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setShowScoreboard(!showScoreboard);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [showScoreboard]);

	usePlaySoundOnMount("intro");

	return (
		<>
			<GameProvider teamNames={teamNames} gameData={gameData}>
				<div className="text-center bg-[url('./assets/images/halloween-background.jpg')] bg-center text-halloweenOrange font-creepster flex flex-col items-center min-h-screen">
					{showScoreboard && (
						<div className="fixed inset-0 bg-black opacity-50 z-40"></div>
					)}
					<Toaster />
					<JumpScare />
					<Navbar setShowScoreboard={setShowScoreboard} />
					<Scoreboard isVisible={showScoreboard} />
					<Outlet />
				</div>
			</GameProvider>
		</>
	);
};

export default Layout;
