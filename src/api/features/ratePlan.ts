import { request, RequestOptions } from '@/utils/request';
import {
  convertToPageDataMaster,
} from '../transforms/mapResponse';
import { IFilter } from './booking';


export async function apiRatePlanSearch(
  body: API.SearchDto,
  isExport?: boolean,
  options?: RequestOptions
) {
  const { searchFields, pagination } = body;
  const filters: { [key: string]: any } = {};

  if (searchFields) {
    searchFields.forEach(field => {
      if (field.value !== undefined && field.value !== null && field.value !== 0 && field.value !== '') {
        if (field.key === 'rate_code') {
          filters[`filter[rate_code][_in]`] = `${field.value}`;
        } else if (field.key === 'hotelId') {
          filters[`filter[hotel][id][_in]`]=`${field.value}`;
        } else if (field.key === 'channelName') {
          filters[`filter[market_segment][id][_in]`]=`${field.value}`;
        } else if (field.key === 'createdAt') {
          const date = field.value;
          filters[`filter[created_date][_gte]`]=`${date}T00:00:00Z`;
          filters[`filter[created_date][_lte]`]=`${date}T23:59:59Z`;
        } else if (field.key === 'modifiedAt') {
          const date = field.value;
          filters[`filter[modified_date][_gte]`]=`${date}T00:00:00Z`;
          filters[`filter[modified_date][_lte]`]=`${date}T23:59:59Z`;
        } else if (field.key === 'createdBy') {
          filters[`filter[username_created][_icontains]`]=`${field.value}`;
        } else if (field.key === 'modifiedBy') {
          filters[`filter[username_modified][_icontains]`]=`${field.value}`;
        } else if (field.key === 'keyword') {
          let keyword = field.value;
            if (typeof keyword == 'string') {
              keyword = keyword.trim();
            }
          filters[`filter[_or][0][rate_code][rate_code][_contains]`] = keyword;
          filters[`filter[_or][1][market_segment][name][_contains]`] = keyword;
          filters[`filter[_or][2][hotel][full_name][_contains]`] = keyword;
        }
      }
    });
  }

  // Tạo query string bằng cách join mảng filters
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

  const url = `/api/cms/items/rate_plan?fields[]=*.*&fields[]=room_rate_detail.*&fields[]=market_segment.*&fields[]=rate_code.*&fields[]=hotel.*${queryString}`;
  try {
    // Gửi request
    const response: any = await request(url, {
      method: 'GET',
      ...options,
    });
    return convertToPageDataMaster(response);
  } catch (error) {
    console.error('Error during hotel search:', error);
    throw error;
  }
}

export async function ratePlanApply(body: any, options?: RequestOptions) {
  try {
    const response = await request(`/api/cms/app-api/rate-plan/apply`, {
      // url: 'http://10.0.170.128:6004/api/booking/booking/search',
      method: 'POST',
      data: body,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during create rate plan:', error);
    throw error;
  }
}

export async function deleteRatePlan(data: any, options?: RequestOptions) {
  try {
    const response = await request(`/api/cms/items/rate_plan`, {
      // url: 'http://10.0.170.128:6004/api/booking/booking/search',
      method: 'DELETE',
			data: data,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during booking search:', error);
    throw error;
  }
}

export async function deleteRatePlans(data: any, options?: RequestOptions) {
  try {
    const response = await request(`/api/cms/items/rate_plan`, {
      // url: 'http://10.0.170.128:6004/api/booking/booking/search',
      method: 'DELETE',
      data: data,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during booking search:', error);
    throw error;
  }
}

export async function createRatePlan(data: any, options?: RequestOptions) {
  try {
    const response = await request(`/api/cms/items/rate_plan`, {
      // url: 'http://10.0.170.128:6004/api/booking/booking/search',
      method: 'POST',
      data: data,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during booking search:', error);
    throw error;
  }
}

export async function updateRatePlan(
  id: string,
  data: any,
  options?: RequestOptions
) {
  try {
    const response = await request(`/api/cms/items/rate_plan/${id}`, {
      // url: 'http://10.0.170.128:6004/api/booking/booking/search',
      method: 'PATCH',
      data: data,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during booking search:', error);
    throw error;
  }
}

export async function viewRatePlan(id: string, options?: RequestOptions) {
  try {
    const response = await request(`/api/cms/items/rate_plan/${id}?fields[]=*.*.*&fields[]=room_rate_detail.room_type.*&fields[]=room_rate_detail.package_plan.*`, {
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

export async function apiPackageList(
  id: string,
  options?: RequestOptions
) {

  try {
    // Gửi request
    const response: any = await request(`/api/cms/items/package_plan?filter[hotel][id][_in]=${id}`, {
      method: 'GET',
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during hotel search:', error);
    throw error;
  }
}

export async function apiRateCodeList(
  id: string,
  options?: RequestOptions
) {

  try {
    // Gửi request
    const response: any = await request(`/api/cms/items/rate_code?filter[hotel][id][_in]=${id}`, {
      method: 'GET',
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during hotel search:', error);
    throw error;
  }
}

export async function getRatePlanByRateCodeID(
  id: string,
  options?: RequestOptions
) {

  try {
    // Gửi request
    const response: any = await request(`/api/cms/items/rate_plan?filter[rate_code][id][_in]=${id}`, {
      method: 'GET',
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during hotel search:', error);
    throw error;
  }
}
