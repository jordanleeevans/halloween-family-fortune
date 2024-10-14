import React from "react";
import { GameProvider } from "../context/GameContext";
import Navbar from "../components/ui/navbar";
import gameData from "../data/gameData.json";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const Layout: React.FC = () => {
	const teamNames = ["Team Spooky", "Team Creepy"];
	return (
		<>
			<GameProvider teamNames={teamNames} gameData={gameData}>
				<div className="text-center bg-[url('./assets/images/halloween-background.jpg')] bg-center text-halloweenOrange font-creepster flex flex-col items-center min-h-screen">
					<Toaster />
					<Navbar />
					{/* TODO: Add Scoreboard */}
					<Outlet />
				</div>
			</GameProvider>
		</>
	);
};

export default Layout;
