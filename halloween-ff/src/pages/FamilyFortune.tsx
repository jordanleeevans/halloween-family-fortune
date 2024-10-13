import React from "react";
import FamilyFortuneCard from "../components/FamilyFortuneCard";
import TeamCard from "@/components/TeamCard";
import { RoundManager } from "../components/RoundManager";

const FamilyFortunePage: React.FC = () => {
	return (
		<div className="family-fortune-page flex-col items-center justify-center gap-8">
			<div className="flex flex-row items-center justify-center gap-4">
				<TeamCard teamIndex={0} />
				<div className="flex flex-col items-center justify-center gap-4 w-full max-w-lg">
					<FamilyFortuneCard />
					<RoundManager />
				</div>
				<TeamCard teamIndex={1} />
			</div>
		</div>
	);
};

export default FamilyFortunePage;
