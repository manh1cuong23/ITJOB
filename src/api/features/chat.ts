import { request, RequestOptions } from '@/utils/request';

export async function getListConversation(data: any, options?: RequestOptions) {
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
  try {
    const response = await request(`/chats/get-conversations`, {
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

export async function getListEmployer(data: any, options?: RequestOptions) {
  const params: any = {};

  // Duyệt qua từng field lọc để gán vào params nếu tồn tại
  [
    'nameEmployer',
    'nameCandicate',
    'status',
    'name',
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
  try {
    const response = await request(`/candidates/list-employer`, {
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

export async function getChat(id: string, data: any, options?: RequestOptions) {
  try {
    const response = await request(`/chats/get-chats/${id}`, {
      method: 'GET',
      params: data,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}

export async function getConvDetail(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/chats/get-conversations/${id}`, {
      method: 'GET',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}

export async function sendChat(data: any, options?: RequestOptions) {
  try {
    const response = await request(`/chats/send-message`, {
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

export async function makeConversation(data: any, options?: RequestOptions) {
  try {
    const response = await request(`/chats/make-conversation`, {
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
