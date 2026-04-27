import { createContext, useCallback, useContext, useState } from "react";
import { getAllProgress, getLessonProgress, updateProgress } from "../api";


const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [allProgress, setAllProgress] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(null);

  const fetchAllProgress = useCallback(async () => {
    try {
      const { data } = await getAllProgress();
      setAllProgress(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchLessonProgress = useCallback(async (lessonId) => {
    try {
      const { data } = await getLessonProgress(lessonId);
      setCurrentProgress(data);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  const markSection = useCallback(
    async (lessonId, level, day, section, quizScore) => {
      try {
        const { data } = await updateProgress({
          lessonId,
          level,
          day,
          section,
          quizScore,
        });
        setCurrentProgress(data);
        return data;
      } catch (err) {
        console.error(err);
      }
    },
    [],
  );

  return (
    <ProgressContext.Provider
      value={{
        allProgress,
        currentProgress,
        setCurrentProgress,
        fetchAllProgress,
        fetchLessonProgress,
        markSection,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);
