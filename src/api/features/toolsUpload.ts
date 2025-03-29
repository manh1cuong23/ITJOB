// @ts-ignore
/* eslint-disable */


import { request, type RequestOptions } from '@/utils/request';


export async function uploadUpload(
  body: API.FileUploadDto,
  file?: File,
  options?: RequestOptions
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach(ele => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach(f => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

	const url = `${
    import.meta.env.VITE_BASE_URL
  }/file/api/media/file/upload-file`;

  return request<any>('/file/api/media/file/upload-file', {
    url: url,
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

export async function uploadImage(
  file: File,
  body?: API.FileUploadDto,
  options?: RequestOptions
) {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }

  return request<any>('/api/cms/files', {
    // url: 'http://10.0.170.128:7002/api/media/file/Create',
    method: 'POST',
    data: formData,
    headers: {
      'X-Api-Key': 'c4ca4238a0b923820dcc509a6f75849b',
    },
    requestType: 'form',
    ...(options || {}),
  });
}
