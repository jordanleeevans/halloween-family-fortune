import React, { useState, useEffect } from "react";
import { playSound } from "@/lib/utils";
import jumpScareImage from "../assets/images/jump-scare.jpg";

const JumpScare: React.FC = () => {
	const [showImage, setShowImage] = useState<boolean>(false);

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
				setShowImage(true);

				playSound("jumpScare");
				setTimeout(() => {
					setShowImage(true);
				}, 500);
				setTimeout(() => {
					setShowImage(false);
				}, 2000);
			}
		};
		window.addEventListener("keydown", handleKeyPress);
	}, []);

	return showImage ? (
		<div className="fixed inset-0 z-50 object-cover w-full h-full flex items-center justify-center bg-black bg-opacity-90">
			<img src={jumpScareImage} alt="Jump Scare" className="object-cover" />
		</div>
	) : null;
};

export default JumpScare;
