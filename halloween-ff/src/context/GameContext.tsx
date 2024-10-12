import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useCallback,
} from "react";
import { Round, Team, Game } from "@/types";
import fuzzysort from "fuzzysort";
import { playSound } from "@/lib/utils";

interface GameContextType {
	teams: Team[];
	setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
	currentRound: Round;
	currentRoundIndex: number;
	nextRound: () => void;
	previousRound: () => void;
	addPoints: (points: number) => void;
	handleSubmit: (e: React.FormEvent, input: string) => void;
	cardMessage: string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{
	children: ReactNode;
	teamNames: string[];
	gameData: Game["rounds"];
}> = ({ children, teamNames, gameData }) => {
	const [teams, setTeams] = useState<Team[]>(
		teamNames.map((name) => ({
			name,
			players: [],
			score: 0,
			isTurn: false,
		}))
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

	const previousRound = () => {
		setCurrentRoundIndex((prevIndex) => {
			let newIndex = 0;
			if (prevIndex === 0) {
				newIndex = gameData.length - 1;
			} else {
				newIndex = (prevIndex - 1) % gameData.length;
			}
			setCurrentRound(gameData[newIndex]);
			return newIndex;
		});

		setCardMessage("");
	};

	const addPoints = (points: number) => {
		setTeams((prevTeams) =>
			prevTeams.map((team) =>
				team.isTurn === true
					? {
							...team,
							score: team.score + points,
							players: team.players.map((player) =>
								player.current === true
									? { ...player, score: player.score + points }
									: player
							),
					  }
					: team
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
		(e: React.FormEvent, input: string) => {
			e.preventDefault();
			const matchedIndex = findMatchedAnswer(input);
			if (matchedIndex !== -1 && !currentRound.answers[matchedIndex].revealed) {
				playSound("correct");
				updateAnswers(matchedIndex);
				setCardMessage(
					`You found "${currentRound.answers[matchedIndex].text}"!`
				);
				setTeams((prevTeams) => {
					const currentTeamIndex = prevTeams.findIndex((team) => team.isTurn);
					const nextTeamIndex = (currentTeamIndex + 1) % prevTeams.length;
					return prevTeams.map((team, index) => ({
						...team,
						isTurn: index === nextTeamIndex,
					}));
				});
				addPoints(currentRound.answers[matchedIndex].points);
			} else if (matchedIndex !== -1) {
				setCardMessage("This answer has already been revealed!");
			} else {
				playSound("incorrect");
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
				setTeams,
				currentRoundIndex,
				currentRound,
				nextRound,
				previousRound,
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
