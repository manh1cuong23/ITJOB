import { request, RequestOptions } from '@/utils/request';

export async function uploadImage(data: any, options?: RequestOptions) {

  try {
    const response = await request(`/medias/upload-image`, {
      method: 'POST',
      data: data,
      requestType: 'form',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}
export async function uploadPdf(data: any, options?: RequestOptions) {
  try {
    const response = await request(`/medias/upload-pdf`, {
      method: 'POST',
      data: data,
      requestType: 'form',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}
