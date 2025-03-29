
import { useEffect, useState } from 'react';

interface UseProgressProps {
  isLoading: boolean;
  setProgress: any;
}

const useProgress = ({ isLoading, setProgress }: UseProgressProps) => {
  const [loading, setLoading] = useState<boolean>(isLoading);

  useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            let startTime = Date.now();
            interval = setInterval(() => {
                let elapsed = (Date.now() - startTime) / 1000;
                setProgress((oldProgress: number) => {
                    if (elapsed < 5 && oldProgress < 80) {
                        return oldProgress + 10;
                    } else if (elapsed >= 5 && oldProgress < 95) {
                        return oldProgress + 5;
                    }
                    return oldProgress;
                });
            }, 500);
        }

        return () => clearInterval(interval);
  }, [isLoading]);
  return;
};

export default useProgress;
