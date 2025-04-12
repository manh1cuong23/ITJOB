import { request, RequestOptions } from '@/utils/request';
export async function getListSkill(options?: RequestOptions) {
  try {
    const response = await request(`/others/skills`, {
      method: 'GET',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function getListFields(options?: RequestOptions) {
  try {
    const response = await request(`/others/fields`, {
      method: 'GET',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}
