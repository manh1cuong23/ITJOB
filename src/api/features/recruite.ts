import { request, RequestOptions } from '@/utils/request';

export async function getListJob(data: any, options?: RequestOptions) {
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
  params: any,
  options?: RequestOptions
) {
  try {
    const response = await request(`/jobs/candidates/${id}`, {
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

export async function getListCountCandicateByJob(
  id: string,
  options?: RequestOptions
) {
  try {
    const response = await request(`/jobs/count/${id}`, {
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
      ['name', 'level', 'type_work', 'year_experience', 'user_id'].forEach(
        field => {
          if (data[field] && data[field].length > 0) {
            params[field] = data[field]; // chuyển mảng thành chuỗi JSON
          }
        }
      );
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

export async function makeApproveCV(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/jobs/approve/${id}`, {
      method: 'POST',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function makeRejectCV(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/jobs/reject/${id}`, {
      method: 'POST',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function makeInterViewCV(
  id: string,
  data: any,
  options?: RequestOptions
) {
  try {
    const response = await request(`/jobs/make-interview/${id}`, {
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

export async function getListCandicateByJobWithStatus(
  id: string,
  status: number | number[],
  options?: RequestOptions
) {
  try {
    const params: any = {}; // Khởi tạo object rỗng

    if (status !== undefined) {
      params.status = status;
    }
    const response = await request(`/jobs/candidates/${id}`, {
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

export async function makeInterviewCV(
  id: string,
  data: any,
  options?: RequestOptions
) {
  try {
    const response = await request(`/jobs/make-interview/${id}`, {
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

export async function acceptInterview(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/jobs/accept-schedule/${id}`, {
      method: 'POST',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function inviteCandicate(
  id: string,
  data?: any,
  options?: RequestOptions
) {
  try {
    const response = await request(`/jobs/invite/${id}`, {
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

export async function changeStatus(
  id: string,
  params: any,
  options?: RequestOptions
) {
  try {
    const response = await request(`/jobs/change-status/${id}`, {
      method: 'PUT',
      params: params,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}
