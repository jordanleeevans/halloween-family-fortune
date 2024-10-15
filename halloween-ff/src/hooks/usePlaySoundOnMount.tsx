import { playSound } from "@/lib/utils";
import { useEffect } from "react";
import { SoundEffect } from "@/lib/utils";

const usePlaySoundOnMount = (soundFile: SoundEffect) => {
	useEffect(() => {
		playSound(soundFile);
	}, [soundFile]); // Empty dependency array ensures this runs only once on mount
};

export default usePlaySoundOnMount;
