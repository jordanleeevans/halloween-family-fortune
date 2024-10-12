import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useCallback,
} from "react";
import { Round, Team, Game } from "@/types";
import fuzzysort from "fuzzysort";

interface GameContextType {
	teams: Team[];
	currentRound: Round;
	currentRoundIndex: number;
	nextRound: () => void;
	addPoints: (teamIndex: number, points: number) => void;
	handleSubmit: (e: React.FormEvent, input: string, teamIndex: number) => void;
	cardMessage: string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{
	children: ReactNode;
	teamNames: string[];
	gameData: Game["rounds"];
}> = ({ children, teamNames, gameData }) => {
	const [teams, setTeams] = useState<Team[]>(
		teamNames.map((name) => ({ name, score: 0 }))
	);
	const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
	const [currentRound, setCurrentRound] = useState<Round>(gameData[0]);
	const [cardMessage, setCardMessage] = useState("");

	const nextRound = () => {
		setCurrentRoundIndex((prevIndex) => {
			const newIndex = (prevIndex + 1) % gameData.length;
			setCurrentRound(gameData[newIndex]);
			return newIndex;
		});
		setCardMessage("");
	};

	const addPoints = (teamIndex: number, points: number) => {
		setTeams((prevTeams) =>
			prevTeams.map((team, index) =>
				index === teamIndex ? { ...team, score: team.score + points } : team
			)
		);
	};

	const findMatchedAnswer = (input: string) => {
		const results = fuzzysort.go(input, currentRound.answers, { key: "text" });
		if (results.length > 0 && results[0].score > -5000) {
			return currentRound.answers.findIndex(
				(a) => a.text === results[0].obj.text
			);
		}
		return -1;
	};

	const updateAnswers = (matchedIndex: number) => {
		const updatedAnswers = [...currentRound.answers];
		updatedAnswers[matchedIndex].revealed = true;
		setCurrentRound({ ...currentRound, answers: updatedAnswers });
	};

	const handleSubmit = useCallback(
		(e: React.FormEvent, input: string, teamIndex: number) => {
			e.preventDefault();
			const matchedIndex = findMatchedAnswer(input);
			if (matchedIndex !== -1 && !currentRound.answers[matchedIndex].revealed) {
				updateAnswers(matchedIndex);
				setCardMessage(
					`You found "${currentRound.answers[matchedIndex].text}"!`
				);
				addPoints(teamIndex, currentRound.answers[matchedIndex].points);
			} else if (matchedIndex !== -1) {
				setCardMessage("This answer has already been revealed!");
			} else {
				setCardMessage("No match found. Try again!");
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentRound, addPoints]
	);

	return (
		<GameContext.Provider
			value={{
				teams,
				currentRoundIndex,
				currentRound,
				nextRound,
				addPoints,
				handleSubmit,
				cardMessage,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGameContext = () => {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error("useGameContext must be used within a GameProvider");
	}
	return context;
};
