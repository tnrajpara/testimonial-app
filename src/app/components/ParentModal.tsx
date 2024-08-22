import React from "react";
import Modal from "./Modal";
import ThanksModal from "./ThanksModal";

interface ModalProps {
  onClose: () => void;
  parentImage: string;
  questions: string[];
  extraQuestions: ExtraQuestion[];
  spaceId: string | "";
  spaceImage: string;
  spaceTitle: string;
}

interface ExtraQuestion {
  text: string;
  value: boolean;
  required: boolean;
}

const ParentModal: React.FC<ModalProps> = ({
  onClose,
  parentImage,
  questions,
  extraQuestions,
  spaceId,
  spaceImage,
  spaceTitle,
}) => {
  const [showThanksModal, setShowThanksModal] = React.useState(false);

  return (
    <>
      {showThanksModal ? (
        <ThanksModal onClose={onClose} />
      ) : (
        <Modal
          onClose={onClose}
          parentImage={parentImage}
          questions={questions}
          extraQuestions={extraQuestions}
          onThanks={() => setShowThanksModal(true)}
          spaceId={spaceId}
          spaceImage={spaceImage}
          spaceTitle={spaceTitle}
        />
      )}
    </>
  );
};

export default ParentModal;
