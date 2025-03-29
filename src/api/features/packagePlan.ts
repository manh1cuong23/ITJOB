import { request, RequestOptions } from '@/utils/request';
import {
  convertToPageDataMaster,
  convertToResponseBooking,
} from '../transforms/mapResponse';
export async function apiPackagePlanSearch(
  body: API.SearchDto,
  isExport?: boolean,
  options?: RequestOptions
) {
  const { searchFields, pagination } = body;
  console.log(searchFields);
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
          if (field.key === 'code') {
            filters['filter[code][_icontains]'] = field.value;
          } else if (field.key === 'name') {
            filters['filter[name][_icontains]'] = field.value;
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
          } else if (field.key === 'service') {
            filters['filter[service][service_id][_in]'] = String(field.value);
          } else if (field.key === 'roomType') {
            filters['filter[room_types][room_type_id][_in]'] = String(
              field.value
            );
          } else if (field.key === 'keyword') {
            let keyword = field.value; // Giả sử `field.value` chứa giá trị của keyword
            if (typeof keyword == 'string') {
              keyword = keyword.trim();
            }

            filters['filter[_or][0][code][_contains]'] = keyword;
            filters['filter[_or][1][name][_contains]'] = keyword;
            filters['filter[_or][2][hotel][short_name][_contains]'] = keyword;
            filters['filter[_or][3][service][service_id][name][_contains]'] =
              keyword;
            filters[
              'filter[_or][4][room_types][room_type_id][name][_contains]'
            ] = keyword;
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

  const url = `/api/cms/items/package_plan?fields[]=*.*&fields[]=room_types.room_type_id.*&fields[]=service.service_id.*.*${queryString}&sort=-date_created`;

  try {
    // Gửi request
    const response = await request(url, {
      ...options,
    });
    return convertToPageDataMaster(response);
  } catch (error) {
    console.error('Error during hotel search:', error);
    throw error;
  }
}
export async function getPackagePlanItem(id: string, options?: RequestOptions) {
  const url = `/api/cms/items/package_plan/${id}?fields[]=*.*&fields[]=service.service_id.*,room_types.room_type_id.*`;

  try {
    // Gửi request
    const response = await request(url, {
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during guest info search:', error);
    throw error;
  }
}
export async function getPackagePlanByHotelId(
  hotelId: string,
  options?: RequestOptions
) {
  const url = `/api/cms/items/package_plan?fields[]=*.*&filter[hotel][id][_eq]=${hotelId}`;

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

export async function createPackagePlan(data: any, options?: RequestOptions) {
  const url = `/api/cms/items/package_plan`;

  try {
    // Gửi request
    const response = await request(url, {
      method: 'POST',
      ...options,
      data: data,
    });
    return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}

export async function updatePackagePlan(
  data: any,
  id: string,
  options?: RequestOptions
) {
  const url = `/api/cms/items/package_plan/${id}`;

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

export async function deletePackagePlan(id: string, options?: RequestOptions) {
  const url = `/api/cms/items/package_plan/${id}`;

  try {
    // Gửi request
    const response = await request(url, {
      method: 'DELETE',
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}
export async function getPackagePlanByCode(
  code: string,
  hotelId?: number,
  options?: RequestOptions
) {
  const url = `/api/cms/items/package_plan?filter[code][_eq]=${code}&filter[hotel][_eq]=${hotelId}`;

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

export async function apiImportFile(file: File, options?: RequestOptions) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await request(
      `/api/cms/app-api/import-excel/package-plan`,
      {
        method: 'POST',
        data: formData,
        responseType: 'blob',
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during special service search:', error);
    throw error;
  }
}
