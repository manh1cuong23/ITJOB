import { request, RequestOptions } from '@/utils/request';

export async function getListUser(data: any, options?: RequestOptions) {
  console.log('dataa', data);

  const params: any = {};

  // Duyệt qua từng field lọc để gán vào params nếu tồn tại
  [
    'key',
    'level',
    'status',
    'type_work',
    'role',
    'active',
    'year_experience',
  ].forEach(field => {
    if (
      data.hasOwnProperty(field) &&
      data[field] !== undefined &&
      data[field] !== null &&
      !(typeof data[field] === 'string' && data[field].trim() === '')
    ) {
      params[field] = data[field];
    }
  });
  if (data.key) {
    params.key = data.key;
  }
  console.log('check para', params);
  try {
    const response = await request(`/admins/list-accounts`, {
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

export async function makeActiveAccount(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/admins/accounts/${id}/unblock`, {
      method: 'PUT',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function makeInActiveAccount(
  id: string,
  options?: RequestOptions
) {
  try {
    const response = await request(`/admins/accounts/${id}/block`, {
      method: 'PUT',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function getListJob(data: any, options?: RequestOptions) {
  const params: any = {};

  // Duyệt qua từng field lọc để gán vào params nếu tồn tại
  [
    'key',
    'level',
    'status',
    'type_work',
    'role',
    'active',
    'year_experience',
  ].forEach(field => {
    if (
      data.hasOwnProperty(field) &&
      data[field] !== undefined &&
      data[field] !== null &&
      !(typeof data[field] === 'string' && data[field].trim() === '')
    ) {
      params[field] = data[field];
    }
  });
  if (data.key) {
    params.key = data.key;
  }
  console.log('check para', params);
  try {
    const response = await request(`/admins/list-jobs`, {
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

export async function getListEnvalutions(data: any, options?: RequestOptions) {
  const params: any = {};

  // Duyệt qua từng field lọc để gán vào params nếu tồn tại
  [
    'nameEmployer',
    'nameCandicate',
    'status',
    'type_work',
    'role',
    'active',
    'year_experience',
  ].forEach(field => {
    if (
      data.hasOwnProperty(field) &&
      data[field] !== undefined &&
      data[field] !== null &&
      !(typeof data[field] === 'string' && data[field].trim() === '')
    ) {
      params[field] = data[field];
    }
  });
  if (data.key) {
    params.key = data.key;
  }
  console.log('check para', params);
  try {
    const response = await request(`/admins/list-envalutions`, {
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

export async function makeActiveEnvalution(
  id: string,
  options?: RequestOptions
) {
  try {
    const response = await request(`/admins/envalution/${id}/active`, {
      method: 'PUT',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}
