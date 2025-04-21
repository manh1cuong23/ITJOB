import { request, RequestOptions } from '@/utils/request';

export async function getDetailInterview(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/apply/${id}`, {
      method: 'GET',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function makePassInterview(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/jobs/make-pass/${id}`, {
      method: 'POST',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function makeFailInterview(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/jobs/make-fail/${id}`, {
      method: 'POST',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}
