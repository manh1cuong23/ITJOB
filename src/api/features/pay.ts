import { request, RequestOptions } from '@/utils/request';
export async function getListTransaction(data?: any, options?: RequestOptions) {
  try {
    const params: any = {};

    // Duyệt qua từng field lọc để gán vào params nếu tồn tại
    ['name', 'createdAt'].forEach(field => {
      if (data[field] && data[field].length > 0) {
        params[field] = JSON.stringify(data[field]); // chuyển mảng thành chuỗi JSON
      }
    });
    if (data.key) {
      params.key = data.key;
    }
    const response = await request(`/transaction/getlist`, {
      method: 'GET',
      params: params,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}
export async function getDetaildPackage(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/package/get/${id}`, {
      method: 'GET',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}
export async function deletePackage(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/package/delete/${id}`, {
      method: 'DELETE',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}
export async function createPayOs(data: any, options?: RequestOptions) {
  try {
    const response = await request(`/payment/create-payment`, {
      method: 'POST',
      data: data,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}
export async function updatePackage(
  id: string,
  data: any,
  options?: RequestOptions
) {
  try {
    const response = await request(`/package/update/${id}`, {
      method: 'PUT',
      data: data,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}

export async function getOverViewTransaction(
  data?: any,
  options?: RequestOptions
) {
  try {
    const params: any = {};

    // Duyệt qua từng field lọc để gán vào params nếu tồn tại
    ['name', 'createdAt'].forEach(field => {
      if (data[field] && data[field].length > 0) {
        params[field] = JSON.stringify(data[field]); // chuyển mảng thành chuỗi JSON
      }
    });
    if (data.key) {
      params.key = data.key;
    }
    const response = await request(`/transaction/get-overview`, {
      method: 'GET',
      params: params,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}
