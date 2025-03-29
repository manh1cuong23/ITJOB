import { request, RequestOptions } from '@/utils/request';

export async function apiQuantityBooking(
  body: API.searchObj[],
  options?: RequestOptions
) {
  const searchFields = Array.isArray(body) ? body : [];

  const fromToValue = searchFields?.find(
    field => field.key === 'from_to'
  )?.value;
  // Định dạng dữ liệu gửi lên server
  const formattedParams = {
    hotelId: searchFields?.find(field => field.key === 'hotelId')?.value || '',
    fromDate: Array.isArray(fromToValue) ? fromToValue[0] : '',
    toDate: Array.isArray(fromToValue) ? fromToValue[1] : '',
  };

  try {
    const response = await request(
      `bev2/api/booking/dashboard/quantity-booking`,
      {
        method: 'POST',
        data: formattedParams,
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during booking search:', error);
    throw error;
  }
}

export async function apiRoomInventory(
  body: API.searchObj[],
  options?: RequestOptions
) {
  const searchFields = Array.isArray(body) ? body : [];

  const fromToValue = searchFields?.find(
    field => field.key === 'from_to'
  )?.value;
  // Định dạng dữ liệu gửi lên server
  const formattedParams = {
    hotelId: searchFields?.find(field => field.key === 'hotelId')?.value || '',
    fromDate: Array.isArray(fromToValue) ? fromToValue[0] : '',
    toDate: Array.isArray(fromToValue) ? fromToValue[1] : '',
    sourceCode:
      searchFields?.find(field => field.key === 'sourceCode')?.value || '',
  };

  try {
    const response = await request(
      `bev2/api/booking/dashboard/room-inventory`,
      {
        method: 'POST',
        data: formattedParams,
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during booking search:', error);
    throw error;
  }
}

export async function apiHotelTop(
  body: API.searchObj[],
  options?: RequestOptions
) {
  const searchFields = Array.isArray(body) ? body : [];

  const fromToValue = searchFields?.find(
    field => field.key === 'from_to'
  )?.value;
  // Định dạng dữ liệu gửi lên server
  const formattedParams = {
    fromDate: Array.isArray(fromToValue) ? fromToValue[0] : '',
    toDate: Array.isArray(fromToValue) ? fromToValue[1] : '',
    isAll: searchFields?.find(field => field.key === 'isAll')?.value || false,
    topNumber: 5,
    orderBy: searchFields?.find(field => field.key === 'orderBy')?.value || '',
  };

  try {
    const response = await request(`bev2/api/booking/dashboard/hotel-top`, {
      method: 'POST',
      data: formattedParams,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during booking search:', error);
    throw error;
  }
}

export async function apiRoomTypeTop(
  body: API.searchObj[],
  options?: RequestOptions
) {
  const searchFields = Array.isArray(body) ? body : [];

  const fromToValue = searchFields?.find(
    field => field.key === 'from_to'
  )?.value;
  // Định dạng dữ liệu gửi lên server
  const formattedParams = {
    hotelId: searchFields?.find(field => field.key === 'hotelId')?.value || '',
    fromDate: Array.isArray(fromToValue) ? fromToValue[0] : '',
    toDate: Array.isArray(fromToValue) ? fromToValue[1] : '',
    isAll: searchFields?.find(field => field.key === 'isAll')?.value || false,
    topNumber: 5,
    orderBy: searchFields?.find(field => field.key === 'orderBy')?.value || '',
  };

  try {
    const response = await request(`bev2/api/booking/dashboard/room-type-top`, {
      method: 'POST',
      data: formattedParams,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during booking search:', error);
    throw error;
  }
}
