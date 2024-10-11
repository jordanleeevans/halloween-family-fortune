export type Answer = {
	answer: string;
	points: number;
};

export type Question = {
	question: string;
	answers: Answer[];
};
