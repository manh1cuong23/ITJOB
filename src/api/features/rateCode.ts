import { request, RequestOptions } from '@/utils/request';
import {
  convertToPageDataMaster,
  convertToResponseBooking,
} from '../transforms/mapResponse';
import { IFilter } from './booking';

export async function apiRateCodeSearch(
  body: API.SearchDto,
	isExport?: boolean,
  options?: RequestOptions
) {
  const { searchFields, pagination } = body;
  const filters: { [key: string]: any } = {};
  if (searchFields) {
    Array.isArray(searchFields) &&
      searchFields.forEach(field => {
        if (
          field.value !== undefined &&
          field.value !== null &&
          field.value !== 0 &&
          field.value !== ''
        ) {
          if (field.key === 'rate_code') {
            filters['filter[rate_code][_icontains]'] = field.value;
          } else if (field.key === 'full_name') {
            filters['filter[name][_icontains]'] = field.value;
          } else if (field.key === 'market_segment') {
            if (typeof field.value == 'string') {
              const values = field.value.split(',').map(v => v.trim()); // Tách chuỗi thành mảng
              filters['filter[market_segment][_in]'] = values.join(','); // Format đúng cho API
            }
          } else if (field.key === 'createdBy') {
            filters['filter[username_created][_in]'] = String(field.value);
          } else if (field.key === 'modifiedBy') {
            filters['filter[username_modified][_in]'] = String(field.value);
          } else if (field.key === 'hotelId') {
            filters['filter[hotel][_in]'] = String(field.value);
          } else if (field.key === 'status') {
            // // filters['filter[status][_in]'] = String(
            // //   field.value
            // // );
            // if (field.value == 'published') {
            //   filters['filter[status][_eq]'] = field.value;
            // } else if (field.value == 'inActive') {
            //   filters['filter[status][_neq]'] = 'published';
            // }
            const statusArray = Array.isArray(field.value)
              ? field.value
              : [field.value];

            if (
              statusArray.includes('published') &&
              statusArray.includes('inActive')
            ) {
              // Nếu chứa cả "published" và "inActive" => Không cần filter status
              delete filters['filter[status]'];
            } else if (statusArray.includes('published')) {
              // Nếu chỉ có "published" => Lọc chính xác "published"
              filters['filter[status][_eq]'] = 'published';
            } else if (statusArray.includes('inActive')) {
              // Nếu chỉ có "inActive" => Lọc những cái có status khác "published"
              filters['filter[status][_neq]'] = 'published';
            }
          } else if (field.key === 'createdAtFromTo') {
            let from = '',
              to = '';

            if (typeof field.value === 'string') {
              [from, to] = field.value.split(',').map(date => date.trim());
            } else if (Array.isArray(field.value) && field.value.length === 2) {
              [from, to] = field.value;
            }

            if (from) {
              filters['filter[date_created][_gte]'] = `${from}T00:00:00Z`;
            }

            if (to) {
              filters['filter[date_created][_lte]'] = `${to}T23:59:59Z`;
            }
          } else if (field.key === 'modifiedAtFromTo') {
            let from = '',
              to = '';

            if (typeof field.value === 'string') {
              [from, to] = field.value.split(',').map(date => date.trim());
            } else if (Array.isArray(field.value) && field.value.length === 2) {
              [from, to] = field.value;
            }

            if (from) {
              filters['filter[date_updated][_gte]'] = `${from}T00:00:00Z`;
            }

            if (to) {
              filters['filter[date_updated][_lte]'] = `${to}T23:59:59Z`;
            }
          } else if (field.key === 'keyword') {
            const keyword = field.value; // Giả sử `field.value` chứa giá trị của keyword

            filters['filter[_or][0][rate_code][_icontains]'] = keyword;
            filters['filter[_or][2][hotel][short_name][_icontains]'] = keyword;
            filters['filter[_or][3][market_segment][name][_icontains]'] =
              keyword;
          }
        }
      });
  }
  filters['filter[status][_ncontains]'] = 'archived';
  // Tạo query string từ filters
  let queryString = new URLSearchParams(filters).toString();

  // Thêm phân trang vào query string
  if (pagination) {
    const { pageNum, pageSize } = pagination;
    const limit = pageSize || 10; // Mặc định là 10
    const offset = (pageNum - 1) * limit; // Tính toán offset dựa trên pageNum
    queryString = `${queryString ? '&' : ''}${queryString}`;

		if (!isExport) {
			queryString += `&limit=${limit}&offset=${offset}`;
		}

		queryString += '&meta=*';
  }
  const url = `/api/cms/items/rate_code?fields[]=*.*&fields[]=room_Type.room_type_id.*${queryString}&sort=-date_created`;

	try {
    // Gửi request
    const response = await request(url, {
			method: 'GET',
      ...options,
    });
    return convertToPageDataMaster(response);
  } catch (error) {
    console.error('Error during hotel search:', error);
    throw error;
  }
}
export async function getRateCodeItem(id: string, options?: RequestOptions) {
	const url = `/api/cms/items/rate_code/${id}?fields[]=*.*&fields[]=room_Type.room_type_id.*`;

	try {
    // Gửi request
    const response = await request(url, {
			method: 'GET',
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during guest info search:', error);
    throw error;
  }
}
export async function createNewRateCode(data: any, options?: RequestOptions) {
	const url = `/api/cms/items/rate_code`;

	try {
    // Gửi request
    const response = await request(url, {
			method: 'POST',
			data: data,
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}
export async function updateRateCode(data: any, id: string, options?: RequestOptions) {
	const url = `/api/cms/items/rate_code/${id}`;

	try {
    // Gửi request
    const response = await request(url, {
			method: 'PATCH',
			data: data,
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}
export async function deleteRateCode(id: string, options?: RequestOptions) {
	const url = `/api/cms/items/rate_code/${id}`;

	try {
    // Gửi request
    const response = await request(url, {
			method: 'DELETE',
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during delete guest:', error);
    throw error;
  }
}

export async function getRateCodeByHotel(
  hotelId: string,
  options?: RequestOptions
) {
	const url = `/api/cms/items/rate_code?fields[]=*.*&filter[hotel][id][_eq]=${hotelId}`;

	try {
    // Gửi request
    const response = await request(url, {
			method: 'GET',
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during guest info search:', error);
    throw error;
  }
}

export async function getRateSettingByHotel(
  hotelId: string,
  options?: RequestOptions
) {
	const url = `/api/cms/app-api/rate-code/get-by-hotel?hotelId=${hotelId}`;

	try {
    // Gửi request
    const response = await request(url, {
			method: 'GET',
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during guest info search:', error);
    throw error;
  }
}

export async function getRateCodeByCode(
  code: string,
  hotelId?: number,
  options?: RequestOptions
) {
	const url = `/api/cms/items/rate_code?filter[rate_code][_eq]=${code}&filter[hotel][_eq]=${hotelId}`;

	try {
    // Gửi request
    const response = await request(url, {
			method: 'GET',
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during guest info search:', error);
    throw error;
  }
}

export async function getRateCodeByID(
  id: string,
  options?: RequestOptions
) {
	const url = `/api/cms/items/rate_code?filter[id][_eq]=${id}&fields[]=room_Type.room_type_id.*`;

	try {
    // Gửi request
    const response = await request(url, {
			method: 'GET',
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during guest info search:', error);
    throw error;
  }
}

export async function getRateCodeList(
  options?: RequestOptions
) {
	const url = `/api/cms/items/rate_code`;

	try {
    // Gửi request
    const response = await request(url, {
			method: 'GET',
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during guest info search:', error);
    throw error;
  }
}

export async function detailRateCode( options?: RequestOptions) {
  try {
    const response = await request(`/api/cms/items/rate_code`, {
      // url: 'http://10.0.170.128:6004/api/booking/booking/search',
      method: 'GET',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during booking search:', error);
    throw error;
  }
}

export async function apiImportFile(file: File, options?: RequestOptions) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await request(`/api/cms/app-api/import-excel/rate-code`, {
      method: 'POST',
      data: formData,
      responseType: 'blob',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during special service search:', error);
    throw error;
  }
}
