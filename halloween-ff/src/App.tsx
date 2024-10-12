import FamilyFortuneCard from "./components/FamilyFortuneCard";
import { GameProvider } from "./context/GameContext";
import Navbar from "./components/ui/navbar";
import gameData from "./data/gameData.json";

function App() {
	const teamNames = ["Team Spooky", "Team Creepy"];

	return (
		<GameProvider teamNames={teamNames} gameData={gameData}>
			<div className="text-center bg-halloweenPurple text-halloweenOrange font-creepster flex flex-col items-center min-h-screen">
				<Navbar />
				<div className="flex-grow flex items-center justify-center">
					<FamilyFortuneCard />
				</div>
			</div>
		</GameProvider>
	);
}

export default App;
