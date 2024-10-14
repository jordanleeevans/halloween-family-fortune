import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useCallback,
} from "react";
import { Round, Team, Game, PointsAccrued } from "@/types";
import fuzzysort from "fuzzysort";
import { playSound } from "@/lib/utils";
import answerActions from "../data/answers.json";
import { useNavigate } from "react-router-dom";
import { enqueueToast } from "@/lib/utils";

interface GameContextProps {
	teams: Team[];
	currentRound: Round;
	currentRoundIndex: number;
	buzzerPlayer: { teamIndex: number | null; playerIndex: number | null };
	pointsAccrued: PointsAccrued[] | undefined;
	wrongAttempts: number;
	setPlayerPoints: (pointsAccrued: PointsAccrued[]) => void;
	handleWrongAnswer: () => void;
	handleCorrectAnswer: (points: number, person: string) => void;
	setBuzzerPlayer: (teamIndex: number, playerIndex: number) => void;
	setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
	setTeamTurn: (teamIndex: number) => void;
	nextRound: () => void;
	previousRound: () => void;
	addPoints: (points: number) => void;
	handleBuzzerWinnerSubmission: (e: React.FormEvent, input: string) => void;
	handleTeamRoundSubmission: (e: React.FormEvent, input: string) => void;
	handleTeamRoundStealSubmission: (e: React.FormEvent, input: string) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

const mockPlayers = [
	{ name: "Player 1", score: 0, current: true },
	{ name: "Player 2", score: 0, current: false },
	{ name: "Player 3", score: 0, current: false },
];

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
	const navigate = useNavigate();
	const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
	const [currentRound, setCurrentRound] = useState<Round>(gameData[0]);
	const [buzzerPlayer, setBuzzerPlayerState] = useState<{
		teamIndex: number | null;
		playerIndex: number | null;
	}>({ teamIndex: null, playerIndex: null });
	const [pointsAccrued, setPointsAccrued] = useState<PointsAccrued[]>([]);
	const [wrongAttempts, setWrongAttempts] = useState<number>(0);

	const setBuzzerPlayer = (teamIndex: number, playerIndex: number) => {
		if (!teams[teamIndex].players[playerIndex].current) {
			enqueueToast("Please select one of the active players!", "error", 3000);
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

	const handleNextPlayer = (teamIndex: number) => {
		setTeams((prevTeams) =>
			prevTeams.map((team, index) => {
				if (index === teamIndex) {
					const currentPlayerIndex = team.players.findIndex(
						(player) => player.current
					);
					let newPlayerIndex: number = 0;
					newPlayerIndex = (currentPlayerIndex + 1) % team.players.length;
					return {
						...team,
						players: team.players.map((player, index) => ({
							...player,
							current: index === newPlayerIndex,
						})),
					};
				}
				return team;
			})
		);
	};

	const nextRound = () => {
		setCurrentRoundIndex((prevIndex) => {
			const newIndex = (prevIndex + 1) % gameData.length;
			setCurrentRound(gameData[newIndex]);
			return newIndex;
		});
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
	};

	const addPoints = (points: number) => {
		setTeams((prevTeams) =>
			prevTeams.map((team) =>
				team.isTurn === true
					? {
							...team,
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

	const setPlayerPoints = (pointsAccrued: PointsAccrued[]) => {
		pointsAccrued.forEach((obj) => {
			setTeams((prevTeams) =>
				prevTeams.map((team) => {
					return {
						...team,
						players: team.players.map((player) => {
							if (player.name === obj.person) {
								return {
									...player,
									score: player.score + obj.points,
								};
							}
							return player;
						}),
					};
				})
			);
		});
	};

	const setStolenPoints = (basePoints: number = 0) => {
		const totalAccruedPoints = pointsAccrued.reduce(
			(acc, obj) => acc + obj.points,
			basePoints
		);
		const totalTeamPlayers = teams.reduce((acc, team) => {
			if (team.canSteal) {
				return acc + team.players.length;
			}
			return acc;
		}, 0);

		const pointsPerPlayer = Math.floor(totalAccruedPoints / totalTeamPlayers);

		setTeams((prevTeams) =>
			prevTeams.map((team) => {
				if (team.canSteal) {
					return {
						...team,
						players: team.players.map((player) => {
							return {
								...player,
								score: player.score + pointsPerPlayer,
							};
						}),
					};
				}
				return team;
			})
		);

		enqueueToast(
			`Each player has stolen ${pointsPerPlayer} points!😈`,
			"success",
			5000
		);
	};

	const removeStolenPoints = () => {
		pointsAccrued.forEach((obj) => {
			setTeams((prevTeams) =>
				prevTeams.map((team) => {
					return {
						...team,
						players: team.players.map((player) => {
							if (player.name === obj.person) {
								return {
									...player,
									score: player.score - obj.points,
								};
							}
							return player;
						}),
					};
				})
			);
		});
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
			enqueueToast(randomAction, "success", 5000);
		} else {
			playSound("incorrect");
			const randomAction: string =
				answerActions.incorrectAnswer.actions[
					Math.floor(
						Math.random() * answerActions.incorrectAnswer.actions.length
					)
				];
			enqueueToast(randomAction, "error", 5000);
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

	const handleBuzzerWinnerSubmission = useCallback(
		(e: React.FormEvent, input: string) => {
			e.preventDefault();
			const team = teams.find((team) => team.isTurn);

			if (!team) {
				enqueueToast("Please select the highlighted player!", "error", 3000);
				return;
			}

			if (!input) {
				enqueueToast(
					"C'mon, you need to put an answer in...duh!",
					"error",
					3000
				);
				return;
			}

			const matchedIndex = findMatchedAnswer(input);
			if (matchedIndex !== -1 && !currentRound.answers[matchedIndex].revealed) {
				handleAction(true);
				updateAnswers(matchedIndex);
				addPoints(currentRound.answers[matchedIndex].points);
			} else if (matchedIndex !== -1) {
				enqueueToast("This answer has already been revealed!", "error", 3000);
			} else {
				handleAction(false);
			}
			// clearBuzzerPlayer();
			// clearTeamTurn();
			// go to next player in team
			const currentTeamIndex = teams.findIndex((team) => team.isTurn);
			handleNextPlayer(currentTeamIndex);
			if (currentRound.answers.some((answer) => answer.revealed)) {
				setTimeout(() => {
					navigate(`/team-round/${currentTeamIndex}`);
				}, 3000);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentRound, addPoints]
	);

	const handleCorrectAnswer = (points: number, person: string) => {
		setPointsAccrued(
			(prev) =>
				prev && [
					...prev,
					{
						points,
						person,
					},
				]
		);
	};

	const handleWrongAnswer = () => {
		setWrongAttempts((prev) => prev + 1);
		if (wrongAttempts + 1 >= 3) {
			enqueueToast(
				"You've had 3 wrong attempts. Time to steal!",
				"error",
				3000
			);
			setWrongAttempts(0);
		}
	};

	const handleTeamRoundSubmission = useCallback(
		(e: React.FormEvent, input: string) => {
			e.preventDefault();
			const team = teams.find((team) => team.isTurn);

			if (!team) {
				enqueueToast("Please select the highlighted player!", "error", 3000);
				return;
			}

			if (!input) {
				enqueueToast(
					"C'mon, you need to put an answer in...duh!",
					"error",
					3000
				);
				return;
			}

			const matchedIndex = findMatchedAnswer(input);
			if (matchedIndex !== -1 && !currentRound.answers[matchedIndex].revealed) {
				handleAction(true);
				updateAnswers(matchedIndex);
				addPoints(currentRound.answers[matchedIndex].points);
				setPointsAccrued(
					(prev) =>
						prev && [
							...prev,
							{
								points: currentRound.answers[matchedIndex].points,
								person: team.players.find((player) => player.current)!.name,
							},
						]
				);
				console.log("pointsAccrued", pointsAccrued);
			} else if (matchedIndex !== -1) {
				enqueueToast("This answer has already been revealed!", "error", 3000);
			} else {
				handleAction(false);
				setWrongAttempts((prev) => prev + 1);
			}
			handleNextPlayer(teams.findIndex((team) => team.isTurn));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentRound, addPoints, teams]
	);

	const handleTeamRoundStealSubmission = useCallback(
		(e: React.FormEvent, input: string) => {
			e.preventDefault();
			const team = teams.find((team) => team.canSteal);

			if (!team) {
				enqueueToast("Please select the highlighted player!", "error", 3000);
				return;
			}

			if (!input) {
				enqueueToast(
					"C'mon, you need to put an answer in...duh!",
					"error",
					3000
				);
				return;
			}

			const matchedIndex = findMatchedAnswer(input);

			if (matchedIndex !== -1 && !currentRound.answers[matchedIndex].revealed) {
				handleAction(true);
				updateAnswers(matchedIndex);
				setStolenPoints(currentRound.answers[matchedIndex].points);
				removeStolenPoints();
				handleNextPlayer(teams.findIndex((team) => team.canSteal));
				nextRound();
				navigate("/family-fortune");
				return;
			}

			if (matchedIndex !== -1) {
				enqueueToast("This answer has already been revealed!", "error", 3000);
				handleNextPlayer(teams.findIndex((team) => team.canSteal));
			}
			handleAction(false);
			teams.forEach((team) => {
				if (team.canSteal) {
					delete team.canSteal;
				}
			});
			handleNextPlayer(teams.findIndex((team) => team.canSteal));
			setWrongAttempts(0);
			nextRound();
			navigate("/family-fortune");
			setPointsAccrued([]);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[addPoints, currentRound.answers, findMatchedAnswer, handleAction, teams]
	);

	return (
		<GameContext.Provider
			value={{
				teams,
				currentRoundIndex,
				currentRound,
				buzzerPlayer,
				pointsAccrued,
				wrongAttempts,
				setPlayerPoints,
				handleWrongAnswer,
				handleCorrectAnswer,
				setBuzzerPlayer,
				setTeams,
				setTeamTurn,
				nextRound,
				previousRound,
				addPoints,
				handleBuzzerWinnerSubmission,
				handleTeamRoundSubmission,
				handleTeamRoundStealSubmission,
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
