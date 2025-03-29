import { request, RequestOptions } from '@/utils/request';
export async function getMarketSegmentByHotelId(
  hotelId: string[] | string | null,
  options?: RequestOptions
) {
  const formatedParams = {
    hotel: { _in: [hotelId] },
  };
  const url = `${
    import.meta.env.VITE_BASE_URL
  }/api/cms/items/market_segment?fields[]=*.*&filter=${JSON.stringify(
    formatedParams
  )}`;

  const fetchOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy roomtype:', error);
    throw error;
  }
}

export async function getMarketSegmentList(
  options?: RequestOptions
) {
  try {
		const response = await request(
      `/api/cms/items/market_segment?fields[]=*.*`,
      {
        method: 'GET',
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy roomtype:', error);
    throw error;
  }
}

export async function getServiceByHotelOnly(
  hotelId: number,
  options?: RequestOptions
) {
  try {
		const response = await request(
      `/api/cms/items/market_segment?filter[hotel][_eq]=${hotelId}`,
      {
        method: 'GET',
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during guest info search:', error);
    throw error;
  }
}
