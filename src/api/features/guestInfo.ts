import { request, RequestOptions } from '@/utils/request';
export async function createNewGuestInfo(data: any, options?: RequestOptions) {
  try {
    const response = await request(`/bev2/api/booking/guest-info/create`, {
      // url: 'http://10.0.230.21:8001/api/crs/guest-info/create',
      method: 'POST',
      data: data,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during booking search:', error);
    throw error;
  }
}

export async function getGuestInfo(id: string, options?: RequestOptions) {
  try {
    const response = await request(
      `/bev2/api/booking/guest-info/find/${id}`,
      {
        //url: `http://10.0.230.21:8001/api/crs/guest-info/find/${id}`,
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

export async function updateGuestInfo(data: any, options?: RequestOptions) {
  try {
    const response = await request(`/bev2/api/booking/guest-info/update`, {
      //url: 'http://10.0.230.21:8001/api/booking/guest-info/update',
      method: 'PUT',
      data: data,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}
