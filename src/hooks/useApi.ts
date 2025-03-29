import { keepPreviousData, useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";

const useApiList = (apiList: (params: any) => Promise<any>) => {
    return useQuery({
        queryKey: ['apiList'],
        queryFn: () => 
        {
            const controller = new AbortController()
            setTimeout(() => {
                controller.abort()
            }, 5000)
            return apiList({})
        },
        placeholderData: keepPreviousData,
    });
};
const useApiCreate = (
    apiCreate: (data: any) => Promise<{ code: number }>
  ): UseMutationResult<{ code: number }, unknown, any> => {
    return useMutation({
      mutationFn: (data) => apiCreate(data),
    });
  };
const useApiUpdate = (
    apiUpdate: (params: { id: string | number;[key: string]: any }, body: any) => Promise<{ code: number }>
): UseMutationResult<{ code: number }, unknown, { id: string | number; body: any }> => {
    return useMutation({
        mutationFn: ({ id, body }) => apiUpdate({ id }, body)
    });
};
const useApiDelete = (
    apiDelete: (params: { id: string | number }) => Promise<any>
): UseMutationResult<any, unknown, { id: string | number }> => {
    return useMutation({
        mutationFn: ({ id }) => apiDelete({ id }),
    });
};
const useApiGetById = (id: string | undefined, apiGetById: ({ id }: { id: string | number }) => Promise<any>, formatViewData?: (data: any) => any) => {
    return useQuery({
        queryKey: ['apiGetById', id],
        queryFn: async () => {
            if (!id) return;
            const res = await apiGetById({ id });
            return formatViewData ? formatViewData(res.data) : res.data;
        },
        enabled: !!id
    }
    );
};

export { useApiList, useApiCreate, useApiUpdate, useApiDelete, useApiGetById };