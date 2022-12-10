import { InputHTMLAttributes } from "react";

interface ButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  secondary?: boolean;
}

function Button({ secondary, ...props }: ButtonProps) {
  return (
    <input
      {...props}
      className={`${
        secondary ? "secondary" : ""
      } w-full py-3 rounded font-medium text-white my-linear-gradient cursor-pointer disabled:opacity-90`}
    />
  );
}

export default Button;
