import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type soundEffect = "correct" | "incorrect" | "intro";
export async function playSound(sound: soundEffect) {
	const path = `../assets/audio/${sound}.mp3`;
	const importPath = await import(path);
	const audio = new Audio(importPath.default);
	audio.play().catch((err) => console.error(err));
}
