import React from "react";
import FamilyFortuneCard from "../components/FamilyFortuneCard";
import { RoundManager } from "../components/RoundManager";

const FamilyFortunePage: React.FC = () => {
	return (
		<div className="family-fortune-page flex-col items-center justify-center gap-8">
			<FamilyFortuneCard />
			<RoundManager />
		</div>
	);
};

export default FamilyFortunePage;
