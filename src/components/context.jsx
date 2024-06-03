import { createContext, useContext, useState } from "react";

const EditableContext = createContext();

export const useEditableContext = () => {
  return useContext(EditableContext);
};

export const QuizContext = ({ children }) => {
  const [quizModal, setQuizModal] = useState(false);
  const [pollModal, setPollModal] = useState(false);
  
  const [successModal, setSuccessModal] = useState(false);

  return (
    <EditableContext.Provider
      value={{
        quizModal,
        setQuizModal,
        pollModal,
        setPollModal,
        successModal,
        setSuccessModal
      }}
    >
      {children}
    </EditableContext.Provider>
  );
};
