import { request, RequestOptions } from '@/utils/request';

export async function getListApplyJob(
  status: any,
  job_id?: any,
  options?: RequestOptions
) {
  try {
    const params: any = {}; // Khởi tạo object rỗng

    if (status !== undefined) {
      params.status = status;
    }
    if (job_id !== undefined) {
      params.job_id = job_id;
    }
    const response = await request(`/candidates/list-apply-job`, {
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

export async function getListInvitedJob(status: any, options?: RequestOptions) {
  try {
    const params: any = {}; // Khởi tạo object rỗng
    if (status !== undefined) {
      params.status = status;
    }
    const response = await request(`/candidates/list-invited-job`, {
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

export async function makeChangeInterviewCV(
  id: string,
  data: any,
  options?: RequestOptions
) {
  try {
    const response = await request(`/jobs/candidate-change-schedule/${id}`, {
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

export async function acceptInviteCV(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/jobs/candidate-accept-invite/${id}`, {
      method: 'POST',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function getDetailEmployer(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/candidates/employer-detail/${id}`, {
      method: 'GET',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function getlistJobForEmployer(
  id: string,
  options?: RequestOptions
) {
  try {
    const response = await request(`/candidates/employer-jobs/${id}`, {
      method: 'GET',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function envalutionEmployer(
  id: string,
  data: any,
  options?: RequestOptions
) {
  try {
    const response = await request(`/candidates/evaluate-employer/${id}`, {
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

export async function getlistEnvalution(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/employers/evaluation/${id}`, {
      method: 'GET',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function getListEmployer(data: any, options?: RequestOptions) {
  try {
    const response = await request(`/candidates/list-employer`, {
      method: 'GET',
      data: data,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}
