import { request, RequestOptions } from '@/utils/request';
export async function getListJobByCandicate(
  data: any,
  options?: RequestOptions
) {
  const params: any = {};

  // Duyệt qua từng field lọc để gán vào params nếu tồn tại
  ['city', 'level', 'type_work', 'year_experience'].forEach(field => {
    if (data[field] && data[field].length > 0) {
      params[field] = JSON.stringify(data[field]); // chuyển mảng thành chuỗi JSON
    }
  });
  if (data.key) {
    params.key = data.key;
  }
  try {
    const response = await request(`/candidates/search-job`, {
      method: 'GET',
      params: params,
      data: data,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}

export async function createNewJob(data: any, options?: RequestOptions) {
  try {
    const response = await request(`/jobs`, {
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
export async function updateJob(
  data: any,
  id: string,
  options?: RequestOptions
) {
  try {
    const response = await request(`/jobs/${id}`, {
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

export async function getDetailJob(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/jobs/${id}`, {
      method: 'GET',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function applyJob(
  id: string,
  data: any,
  options?: RequestOptions
) {
  try {
    const response = await request(`/candidates/apply-job/${id}`, {
      method: 'POST',
      data: data,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}
