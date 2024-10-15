import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Import sound files statically
import correctSound from "../assets/audio/correct.mp3";
import incorrectSound from "../assets/audio/incorrect.mp3";
import jumpScareSound from "../assets/audio/jumpscare.mp3";
import introMusic from "../assets/audio/intro.mp3";

// Map sound effects to their corresponding imports
const soundMap = {
	correct: correctSound,
	incorrect: incorrectSound,
	jumpScare: jumpScareSound,
	intro: introMusic,
} as const;

export type SoundEffect = keyof typeof soundMap;

// Function to play sound
export async function playSound(sound: SoundEffect) {
	const audio = new Audio(soundMap[sound]);
	audio.play().catch((err) => console.error(err));
}

export function enqueueToast(
	message: string,
	type: "error" | "success",
	duration: number = 5000
) {
	const baseStyle = {
		backgroundColor: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
		border: "3px solid #E66C2C",
		color: "#E66C2C",
		padding: "16px",
		borderRadius: "8px",
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
		fontSize: "24px",
	};
	switch (type) {
		case "error":
			toast.error(message, {
				duration: duration,
				style: baseStyle,
			});
			break;
		case "success":
			toast.success(message, {
				duration: duration,
				style: baseStyle,
			});
			break;
		default:
			break;
	}
}
