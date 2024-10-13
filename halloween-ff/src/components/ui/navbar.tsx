import React from "react";

const GameTitle: React.FC = () => {
	return (
		<div className="flex text-2xl font-bold text-halloweenOrange">
			Halloween Family Fortune
		</div>
	);
};

const Navbar: React.FC = () => {
	return (
		<div className="w-full text-halloweenOrange p-4 flex justify-between items-center shadow-xl rounded-bl-lg rounded-br-lg sticky mb-8 bg-gradient-to-b from-halloweenBlack to-black/30 animate-in fade-in slide-in-from-top-10 duration-500">
			<GameTitle />
		</div>
	);
};

export default Navbar;
