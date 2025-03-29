import { request, RequestOptions } from '@/utils/request';
export async function getAllHotel(options?: RequestOptions) {
  try {
		const response = await request(
      `/bev2/api/booking/hotel/search`,
      {
        method: 'POST',
        data: {
					pagination: {
						pageIndex: 1,
						pageSize: 100,
						isAll: true,
					},
					filter: {},
				},
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during hotel search:', error);
    throw error;
  }
}
