import { useEffect, useState } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Import NProgress CSS

interface UseNProgressProps {
  isLoading: boolean;
  delay?: number;
}

const useNProgress = ({ isLoading, delay = 200 }: UseNProgressProps) => {
  const [loading, setLoading] = useState<boolean>(isLoading);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isLoading) {
      timer = setTimeout(() => {
        setLoading(true);
        NProgress.start();
      }, delay);
    } else {
      setLoading(false);
      NProgress.done();
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      NProgress.done();
    };
  }, [isLoading, delay]);

  return;
};

export default useNProgress;
