import React, { FC } from "react";

interface Props {
  title: string;
  disabled?: boolean;
  onClick?: () => void;
  myClass?: string;
}

const Btn: FC<Props> = ({ title, disabled, onClick, myClass }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-[#6EBB2F] text-lg text-center transition-all duration-100 active:bg-[#5b8e32] py-1 px-6 md:py-1.5 md:px-4 xl:py-2.5 xl:px-8 rounded-4xl ${myClass} ${
        disabled ? "cursor-no-drop" : "cursor-pointer"
      }`}
    >
      {disabled ? "Loading" : title}
    </button>
  );
};

export default Btn;
