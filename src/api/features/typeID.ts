import { RequestOptions } from '@/utils/request';

export async function getTypeID(options?: RequestOptions) {
  const url = `${
    import.meta.env.VITE_BASE_URL
  }/api/cms/items/identification_type`;

  const fetchOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy type ID:', error);
    throw error;
  }
}
