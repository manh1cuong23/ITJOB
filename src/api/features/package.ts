import { request, RequestOptions } from '@/utils/request';

export async function getAllPackage(hotelId: string, options?: RequestOptions) {
	const url = `/inv/api/cm/inventory/ta-available/get-packages`;

  try {
    const response = await request(url, {
			method: 'GET',
			params: {
				hotelId,
			},
    	...options,
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy salutation:', error);
    throw error;
  }
}
