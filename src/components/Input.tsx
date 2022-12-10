import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

function Input({ ...props }: InputProps) {
  return <input className="w-full px-5 py-3  border border-[#959595] outline-none focus:border-[#0168EB] rounded" {...props} />;
}

export default Input;
