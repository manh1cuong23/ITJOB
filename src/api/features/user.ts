import { request, RequestOptions } from '@/utils/request';
import { convertToPageDataMaster } from '../transforms/mapResponse';

export async function apiUserSearch(
  body: API.SearchDto,
  options?: RequestOptions) {
  const { searchFields, pagination } = body;
  // Tạo filter từ searchFields
  const filters = (searchFields || []).filter(field => field.value !== '').map(field => {
		if (field.key === 'IsActive') {
			return {
				propertyValue: field.value === 'published' ? true : false,
				propertyName: field.key,
				propertyType: 'boolean',
				operator: '==',
			};
		} else if (field.key === 'LastName') {
			const lastName = typeof field.value === 'string' ? field.value.split(' ').pop() || '' : '';
			return {
				propertyValue: lastName,
				propertyName: field.key,
				propertyType: 'string',
				operator: 'Contains',
			};
		} else {
			return {
				propertyValue: field.value,
				propertyName: field.key,
				propertyType: 'string',
				operator: 'Contains',
			};
		}
  });

	const filterGroup = filters.length > 0 ? [{ filters, condition: 'And' }] : [];

  const payload = {
    pagination: {
      pageIndex: pagination?.pageNum || 1,
      pageSize: pagination?.pageSize || 10,
      isAll: false,
    },
    filter: {
      filterGroup,
    },
  };

  const url = `auth/api/permission/user/search`;

  try {
    // Gửi request
    const response = await request(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			data: payload,
			...options
    });
    return convertToPageDataMaster(response);
  } catch (error) {
    console.error('Error during hotel search:', error);
    throw error;
  }
}

export async function apiUserList(
  options?: RequestOptions) {
  // Tạo filter từ searchField

  const payload = {
		pagination: {
			pageIndex: 1,
			pageSize: 15,
			isAll: true
    },
    filter: {
			filterGroup: []
    }
  };

  const url = `auth/api/permission/user/search`;
	const token = localStorage.getItem('token');

  try {
    // Gửi request
    const response = await request(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			data: payload,
			...options
    });
    return response;
  } catch (error) {
    console.error('Error during hotel search:', error);
    throw error;
  }
}