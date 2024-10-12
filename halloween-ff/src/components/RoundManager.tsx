import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from "react-icons/hi";
import { useGameContext } from "../context/GameContext";
import { Button } from "./ui/button";

export const RoundManager: React.FC = () => {
	const { nextRound, prevRound } = useGameContext();

	return (
		<div className="flex space-x-4 py-4 px-16">
			<Button
				onClick={prevRound}
				className="bg-halloweenOrange hover:bg-orange-600 flex-1 flex items-center justify-between"
			>
				<HiOutlineArrowSmLeft className="inline-block mr-2" />
				Previous Round
			</Button>
			<Button
				onClick={nextRound}
				className="bg-halloweenOrange hover:bg-orange-600 flex-1 flex items-center justify-between"
			>
				Next Round
				<HiOutlineArrowSmRight className="inline-block ml-2" />
			</Button>
		</div>
	);
};
