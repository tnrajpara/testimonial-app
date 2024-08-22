import React, { FC } from "react";
import { IoMdClose } from "react-icons/io";

interface ThanksModalProps {
  onClose: () => void;
}

const ThanksModal: FC<ThanksModalProps> = ({ onClose }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 flex-col">
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <button
              className="absolute top-2 right-2 text-gray-100 hover:text-gray-300"
              onClick={onClose}
            >
              <IoMdClose size={24} />
            </button>
            <img src="/dance.gif" className="w-4/5" alt="" />
            <div className="border-b-4 border-gray-50 w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThanksModal;
