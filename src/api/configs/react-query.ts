import { keepPreviousData, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 phút
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      // placeholderData: keepPreviousData,
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    },
    mutations: {
      // Thiết lập cho mutations nếu cần
    },
  },
});

export default queryClient;
