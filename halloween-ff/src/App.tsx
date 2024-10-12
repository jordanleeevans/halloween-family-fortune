import FamilyFortuneCard from "./components/FamilyFortuneCard";
import { GameProvider } from "./context/GameContext";
import Navbar from "./components/ui/navbar";
import gameData from "./data/gameData.json";
import { RoundManager } from "./components/RoundManager";

function App() {
	const teamNames = ["Team Spooky", "Team Creepy"];

	return (
		<GameProvider teamNames={teamNames} gameData={gameData}>
			<div className="text-center bg-[url('./assets/images/halloween-background.jpg')] bg-center text-halloweenOrange font-creepster flex flex-col items-center min-h-screen">
				<Navbar />
				<div className="flex-col items-center justify-center gap-8">
					<FamilyFortuneCard />
					<RoundManager />
				</div>
			</div>
		</GameProvider>
	);
}

export default App;
