import { request, RequestOptions } from '@/utils/request';
export async function getListPackage(options?: RequestOptions) {
  try {
    const response = await request(`/package/get`, {
      method: 'GET',
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
export async function createNewPackage(data: any, options?: RequestOptions) {
  try {
    const response = await request(`/package/create`, {
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
