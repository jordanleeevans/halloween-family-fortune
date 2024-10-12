export type Answer = {
	text: string;
	revealed?: boolean;
	points: number;
};

export type Round = {
	question: string;
	answers: Answer[];
};

export type Game = {
	rounds: Round[];
	teams: Team[];
};

export type Team = {
	name: string;
	score: number;
	isTurn: boolean;
};
