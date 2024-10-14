import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameContext } from "@/context/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Tile from "@/components/ui/tile";
import { Player, Team } from "@/types";

const TeamRoundPage: React.FC = () => {
	const { teamIndex } = useParams();
	const navigate = useNavigate();
	const {
		currentRound,
		wrongAttempts,
		handleWrongAnswer,
		setTeams,
		setTeamTurn,
	} = useGameContext();

	useEffect(() => {
		if (wrongAttempts < 3) {
			return;
		}
		const otherTeamsindex = (parseInt(teamIndex!) + 1) % 2;
		handleWrongAnswer();
		setTeamTurn(otherTeamsindex);
		setTeams((teams) =>
			teams.map((team, index) => ({
				...team,
				canSteal: index === otherTeamsindex,
			}))
		);
		navigate(`/team-round/${otherTeamsindex}`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wrongAttempts]);

	if (!teamIndex) {
		return null;
	}

	return (
		<div className="team-round-page flex-col items-center justify-center gap-8">
			<div className="flex flex-row items-center justify-center gap-4">
				<div className="flex flex-col items-center justify-center gap-4 w-full max-w-lg">
					<WrongAttemptsRow />
					<TeamRoundTeamCard teamIndex={parseInt(teamIndex)} />
				</div>
				<TeamRoundQuestionCard />
			</div>
			{currentRound.answers.every((answer) => answer.revealed) && (
				<SuccessButton />
			)}
		</div>
	);
};

const TeamRoundQuestionCard: React.FC = () => {
	const [input, setInput] = useState<string>("");
	const {
		currentRoundIndex,
		currentRound,
		handleTeamRoundSubmission,
		teams,
		handleTeamRoundStealSubmission,
	} = useGameContext();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setInput("");

		const currentTeam = teams.find((team) => team.isTurn);

		if (currentTeam?.canSteal) {
			handleTeamRoundStealSubmission(e, input);
		} else {
			handleTeamRoundSubmission(e, input);
		}
	};
	return (
		<Card className="bg-halloweenBlack border-2 border-halloweenOrange text-white shadow-xl hover:scale-105 transition-transform duration-500">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-halloweenOrange text-center">
					Round {currentRoundIndex + 1}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<TeamRoundTitle />
				<div className="space-y-2 mb-4">
					{currentRound.answers.map((answer, index) => (
						<Tile key={index} answer={answer} />
					))}
				</div>
				<form
					onSubmit={(e) => {
						handleSubmit(e);
					}}
					className="flex space-x-2 mb-4"
				>
					<Input
						type="text"
						placeholder="Enter your guess"
						value={input}
						onChange={(e) => {
							setInput(e.target.value);
						}}
						className="bg-gray-700 text-white text-center border-halloweenOrange"
					/>
					<Button
						type="submit"
						className="bg-halloweenOrange hover:bg-orange-600"
					>
						Submit
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

const TeamRoundTitle: React.FC = () => {
	const { currentRound } = useGameContext();
	return (
		<h2 className="text-xl mb-4 text-center transition-opacity duration-500">
			{currentRound.question}
		</h2>
	);
};

const WrongAttemptsRow: React.FC = () => {
	const { wrongAttempts } = useGameContext();
	return (
		<div className="flex space-x-2">
			{[...Array(3)].map((_, index) => (
				<span
					key={index}
					className={`text-7xl tracking-widest font-bold transition-opacity duration-500 ${
						index < wrongAttempts ? "opacity-100" : "opacity-20"
					}`}
				>
					❌
				</span>
			))}
		</div>
	);
};

interface TeamRoundTeamCardProps {
	teamIndex: number;
}

const TeamRoundTeamCard: React.FC<TeamRoundTeamCardProps> = ({ teamIndex }) => {
	const { teams, setBuzzerPlayer, setTeamTurn } = useGameContext();

	const handlePlayerClick = (index: number) => {
		setTeamTurn(teamIndex);
		setBuzzerPlayer(teamIndex, index);
	};

	return (
		<Card className="bg-halloweenBlack border-2 border-halloweenOrange text-white shadow-xl">
			<CardHeader className="flex justify-between">
				<CardTitle className="text-2xl font-bold text-halloweenOrange mb-2">
					{teams[teamIndex].name}
				</CardTitle>
				<CardContent className="flex flex-col items-center">
					{teams[teamIndex].players.map((player, index) => (
						<PlayerTile
							key={index}
							player={player}
							onClick={() => {
								handlePlayerClick(index);
							}}
						/>
					))}
					<ScoreTile team={teams[teamIndex]} />
				</CardContent>
			</CardHeader>
		</Card>
	);
};

interface PlayerTileProps {
	player: Player;
	onClick: () => void;
}

const PlayerTile: React.FC<PlayerTileProps> = ({ player, onClick }) => {
	return (
		<div
			className={`w-full p-4 mb-2 mx-16 text-center rounded-md transition-all duration-300 hover:text-white  ${
				player.current
					? "bg-halloweenGreen text-white animate-float border-2 border-white shadow-white shadow-md hover:bg-green-900 hover:cursor-pointer"
					: "bg-halloweenOrange"
			}`}
			onClick={onClick}
		>
			<div className="flex justify-between items-center">
				<div className="flex items-center">
					<div>{player.name}</div>
				</div>
				<div className="text-sm">{player.score} points</div>
			</div>
		</div>
	);
};

const FailureButton: React.FC = () => {
	return <Button className="bg-red-500 hover:bg-red-600">Steal Round</Button>;
};

const SuccessButton: React.FC = () => {
	const navigate = useNavigate();
	const { pointsAccrued, setPlayerPoints, nextRound } = useGameContext();
	const handleOnClick = () => {
		if (pointsAccrued) {
			setPlayerPoints(pointsAccrued);
		}
		nextRound();
		navigate("/family-fortune");
	};
	return (
		<Button
			onClick={handleOnClick}
			className="bg-halloweenGreen hover:bg-green-600"
		>
			Next Round
		</Button>
	);
};

const ScoreTile: React.FC<{ team: Team }> = ({ team }) => {
	return (
		<div className="flex flex-col items-center text-2xl text-red-500 mt-4">
			<span>{team.players.reduce((acc, player) => acc + player.score, 0)}</span>
		</div>
	);
};
export default TeamRoundPage;
