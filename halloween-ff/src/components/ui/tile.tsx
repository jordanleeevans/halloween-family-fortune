import React from "react";
import { FaGhost, FaQuestion } from "react-icons/fa";
import { Answer } from "@/types";

interface TileProps {
	answer: Answer;
}

const Tile: React.FC<TileProps> = ({ answer }) => (
	<div
		className={`w-full p-4 mb-2 text-center rounded-md transition-all duration-300 hover:bg-halloweenOrange hover:text-white border border-white 
       ${
					answer.revealed
						? "bg-halloweenOrange text-white"
						: "bg-halloweenGreen"
				}`}
	>
		{answer.revealed ? (
			<div className="flex justify-between items-center">
				<div className="flex items-center">
					<FaGhost className="inline-block mr-2" />
					<div>{answer.text}</div>
				</div>
				<div className="text-2xl">{answer.points}</div>
			</div>
		) : (
			<FaQuestion className="inline-block mr-2" />
		)}
	</div>
);

export default Tile;
