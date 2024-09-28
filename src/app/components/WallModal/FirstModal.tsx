import React from "react";
import { IoMdClose } from "react-icons/io";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface FirstModalProps {
  onClose: () => void;
}

const FirstModal: React.FC<FirstModalProps> = ({ onClose }) => {
  const [jumpToStep, setJumpToStep] = React.useState(1);
  const [copied, setCopied] = React.useState(false);

  const code = `<iframe src="http://localhost:3000/embed?id=e381bf31-31ee-45e9-981c-96113d511dcd" width="100%" height="841px" scrolling="no" id="testimonial-embed" frameborder="0"></iframe>
<script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.2/iframeResizer.min.js"></script>
<script>iFrameResize({checkOrigin: false,heightCalculationMethod: "lowestElement"},"#testimonial-embed");</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
        <div
          className="fixed inset-0 bg-[#] bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-[#0b0b0b] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-[#f4f4f4]">
          <div className=" px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <span className="font-bold text-2xl">Embed Wall of Love</span>
            <button
              className="absolute top-2 right-2 text-gray-100 hover:text-gray-300"
              onClick={onClose}
            >
              <IoMdClose size={24} />
            </button>
          </div>
          <div className="flex space-x-5 justify-center items-center mb-3 ">
            <span className="bg-[#f4f4f4]  rounded-full text-[#0b0b0b] w-1/6 h-1/6 px-2 py-1 text-center">
              Step- {jumpToStep}
            </span>
            <span>
              {jumpToStep === 1
                ? "Choose Layout"
                : "Customize your wall of love"}
            </span>
          </div>
          {jumpToStep === 1 ? (
            <div className=" p-4">
              <div className="flex justify-center items-center space-x-4">
                <div
                  className="h-[15rem] w-[10rem] bg-gray-200"
                  onClick={() => {
                    setJumpToStep(2);
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="relative mb-4">
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 text-[#0b0b0b] bg-[#f4f4f4] px-2 py-1 rounded text-sm"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <SyntaxHighlighter
                language="html"
                style={atomDark}
                customStyle={{
                  padding: "1rem",
                  fontSize: "14px",
                  margin: "0",
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirstModal;
