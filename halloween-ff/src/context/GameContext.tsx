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
import { toast } from "react-hot-toast";
import answerActions from "../data/answers.json";

interface GameContextProps {
	teams: Team[];
	currentRound: Round;
	currentRoundIndex: number;
	buzzerPlayer: { teamIndex: number | null; playerIndex: number | null };
	setBuzzerPlayer: (teamIndex: number, playerIndex: number) => void;
	setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
	setTeamTurn: (teamIndex: number) => void;
	nextRound: () => void;
	previousRound: () => void;
	addPoints: (points: number) => void;
	handleSubmit: (e: React.FormEvent, input: string) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

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
	const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
	const [currentRound, setCurrentRound] = useState<Round>(gameData[0]);
	const [buzzerPlayer, setBuzzerPlayerState] = useState<{
		teamIndex: number | null;
		playerIndex: number | null;
	}>({ teamIndex: null, playerIndex: null });

	const setBuzzerPlayer = (teamIndex: number, playerIndex: number) => {
		if (!teams[teamIndex].players[playerIndex].current) {
			toast.error("Please select one of the active players!", {
				duration: 3000,
			});
			return;
		}
		setBuzzerPlayerState({ teamIndex, playerIndex });
	};

	const clearBuzzerPlayer = () => {
		setBuzzerPlayerState({ teamIndex: null, playerIndex: null });
	};

	const handleNextPlayers = (direction: "next" | "previous") => {
		setTeams((prevTeams) =>
			prevTeams.map((team) => {
				const currentPlayerIndex = team.players.findIndex(
					(player) => player.current
				);
				let newPlayerIndex: number = 0;

				if (direction === "next") {
					newPlayerIndex = (currentPlayerIndex + 1) % team.players.length;
				} else if (direction === "previous") {
					newPlayerIndex =
						(currentPlayerIndex - 1 + team.players.length) %
						team.players.length;
				}

				return {
					...team,
					players: team.players.map((player, index) => ({
						...player,
						current: index === newPlayerIndex,
					})),
				};
			})
		);
	};

	const nextRound = () => {
		setCurrentRoundIndex((prevIndex) => {
			const newIndex = (prevIndex + 1) % gameData.length;
			setCurrentRound(gameData[newIndex]);
			return newIndex;
		});
		handleNextPlayers("next");
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
		handleNextPlayers("previous");
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

	const setTeamTurn = (teamIndex: number) => {
		setTeams((prevTeams) =>
			prevTeams.map((team, index) =>
				index === teamIndex
					? { ...team, isTurn: true }
					: { ...team, isTurn: false }
			)
		);
	};

	const clearTeamTurn = () => {
		setTeams((prevTeams) =>
			prevTeams.map((team) => ({ ...team, isTurn: false }))
		);
	};

	const handleAction = (isCorrect: boolean) => {
		if (isCorrect) {
			playSound("correct");
			const randomAction: string =
				answerActions.correctAnswer.actions[
					Math.floor(Math.random() * answerActions.correctAnswer.actions.length)
				];
			toast.success(randomAction, {
				duration: 5000,
			});
		} else {
			playSound("incorrect");
			const randomAction: string =
				answerActions.incorrectAnswer.actions[
					Math.floor(
						Math.random() * answerActions.incorrectAnswer.actions.length
					)
				];
			toast.error(randomAction, {
				duration: 5000,
			});
		}
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
			const team = teams.find((team) => team.isTurn);

			if (!team) {
				toast.error("Please select the player who hit the buzzer!", {
					duration: 3000,
				});
				return;
			}

			if (!input) {
				toast.error("C'mon, you need to put an answer in...duh!", {
					duration: 3000,
				});
				return;
			}

			const matchedIndex = findMatchedAnswer(input);
			if (matchedIndex !== -1 && !currentRound.answers[matchedIndex].revealed) {
				handleAction(true);
				updateAnswers(matchedIndex);
				addPoints(currentRound.answers[matchedIndex].points);
			} else if (matchedIndex !== -1) {
				toast.error("This answer has already been revealed!", {
					duration: 3000,
				});
			} else {
				handleAction(false);
			}
			clearBuzzerPlayer();
			clearTeamTurn();
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
				buzzerPlayer,
				setBuzzerPlayer,
				setTeams,
				setTeamTurn,
				nextRound,
				previousRound,
				addPoints,
				handleSubmit,
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
