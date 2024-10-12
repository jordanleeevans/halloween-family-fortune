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

export type Player = {
	name: string;
	score: number;
	current: boolean;
};

export type Team = {
	name: string;
	players: Player[];
	score: number;
	isTurn: boolean;
};
