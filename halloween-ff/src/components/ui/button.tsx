import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
}

export const Button: React.FC<ButtonProps> = ({
	className,
	children,
	...props
}) => {
	return (
		<button
			className={cn(
				"relative inline-block font-medium group py-1.5 px-2.5 rounded-md",
				className
			)}
			{...props}
		>
			<span className="absolute inset-0 w-full h-full transition duration-400 ease-out transform translate-x-1 translate-y-1 rounded-md bg-halloweenOrange group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
			<span className="absolute inset-0 w-full h-full bg-gray-300 border border-halloweenOrange group-hover:bg-orange-50 rounded-md"></span>
			<span className="relative text-halloweenOrange">{children}</span>
		</button>
	);
};

export default { Button };
