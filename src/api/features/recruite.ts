import { request, RequestOptions } from '@/utils/request';

export async function getListJob(data: any, options?: RequestOptions) {
  console.log('data', data);
  const params: any = {};
  // Duyệt qua từng field lọc để gán vào params nếu tồn tại
  ['key', 'level', 'status', 'type_work', 'year_experience'].forEach(field => {
    if (data[field] != undefined && data[field] != null && data[field] != '') {
      params[field] = data[field];
    }
  });

  if (data.key) {
    params.key = data.key;
  }
  console.log('check para', params);
  try {
    const response = await request(`/jobs/list`, {
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

export async function getListCandicateByJob(
  id: string,
  options?: RequestOptions
) {
  try {
    const response = await request(`/jobs/candidates/${id}`, {
      method: 'GET',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function getListCandicate(data?: any, options?: RequestOptions) {
  const params: any = {};
  try {
    if (data) {
      ['name', 'level', 'type_work', 'year_experience'].forEach(field => {
        if (data[field] && data[field].length > 0) {
          params[field] = data[field]; // chuyển mảng thành chuỗi JSON
        }
      });
      if (data.key) {
        params.key = data.key;
      }
    }
    console.log('key params', params);
    const response = await request(`/employers/get-candicate`, {
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
