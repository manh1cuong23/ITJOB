import { request, RequestOptions } from '@/utils/request';
import {
  convertToPageDataMaster,
  convertToResponseBooking,
} from '../transforms/mapResponse';
import { IFilter } from './booking';

export async function apiGuestProfileSearch(
  body: API.SearchDto,
  options?: RequestOptions
) {
  const { pagination, searchFields } = body;

  const filtersAnd: IFilter[] = [];
  if (searchFields && Array.isArray(searchFields)) {
    searchFields.forEach((field: API.searchObj) => {
      const operator = Array.isArray(field.value)
        ? 'In'
        : field.key.includes('Date') ||
          field.key.includes('Time') ||
          field.key.includes('At')
        ? '=='
        : typeof field.value === 'string'
        ? 'Contains'
        : '==';
      let propertyType =
        field.key === 'phone'
          ? 'string'
          : field.key.includes('Date') ||
            field.key.includes('Time') ||
            field.key.includes('At')
          ? 'date'
          : Array.isArray(field.value)
          ? typeof field.value[0] === 'number'
            ? 'number'
            : 'string'
          : typeof field.value === 'number'
          ? 'number'
          : 'string';
      if (
        field.value !== undefined &&
        field.value !== '' &&
        field.value !== null &&
        field.value !== 'NaN'
      ) {
        // Cast value to string if propertyType is 'string'
        let formattedValue =
          propertyType === 'string'
            ? Array.isArray(field.value)
              ? field.value.map(String)
              : String(field.value)
            : field.value;
        filtersAnd.push({
          propertyValue: formattedValue,
          propertyName: field.key,
          propertyType: propertyType,
          operator: operator,
        });
      }
    });
  }

  const formatedBody = {
    pagination: {
      pageIndex: pagination?.pageNum || 1,
      pageSize: pagination?.pageSize || 15,
      isAll: false,
    },
    filter:
      filtersAnd.length > 0
        ? {
            filterGroup: [
              {
                filters: filtersAnd,
                condition: 'And', // Điều kiện 'And' giữa các filters
              },
            ],
          }
        : { filterGroup: [] }, // Nếu không có filters thì gửi filterGroup rỗng
  };

  try {
    const response = await request(`/bev2/api/booking/guest-info/search`, {
      // url: 'http://10.0.170.128:6004/api/booking/booking/search',
      method: 'POST',
      data: formatedBody,
      ...(options || {}),
    });
    return convertToResponseBooking(response);
  } catch (error) {
    console.error('Error during booking search:', error);
    throw error;
  }
}

export async function deleteGuestProfile(id: string, options?: RequestOptions) {
  try {
    const response = await request(
      `/bev2/api/booking/guest-info/delete/${id}`,
      {
        method: 'DELETE',
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during delete guest:', error);
    throw error;
  }
}
export async function getCountry(options?: RequestOptions) {
  try {
		const response = await request(
      `/api/cms/items/country?limit=-1`,
      {
        method: 'GET',
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during country search:', error);
    throw error;
  }
}

export async function getProvince(
  country_code: string,
  options?: RequestOptions
) {
  try {
    if (!country_code) {
      throw new Error('Country code is required.');
    }
    const response = await request(
			`/api/cms/items/provinces?fields[]=*.*&filter={ "country_code": {"_eq": ${JSON.stringify(country_code)}}}&limit=-1`,
			{
				method: 'GET',
				...(options || {}),
			});
    return response;
  } catch (error) {
    console.error('Error during province search:', error);
    throw error;
  }
}

export async function getDistrict(
  province_code: string,
  options?: RequestOptions
) {
  try {
    if (!province_code) {
      throw new Error('Province code is required.');
    }
		const response = await request(
      `/api/cms/items/districts?fields[]=*.*&filter={ "province_code": {"_eq":  ${JSON.stringify(province_code)}}}&limit=-1`,
      {
        method: 'GET',
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during district search:', error);
    throw error;
  }
}

export async function getWards(
  district_code: string,
  options?: RequestOptions
) {
  try {
    const params = {
      field: ['*.*'],
      filter: { district_code: { _eq: district_code } },
    };
		const response = await request(
      `/api/cms/items/wards?fields[]=*.*&filter=${encodeURIComponent(JSON.stringify(params.filter))}&limit=-1`,
      {
        method: 'GET',
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during district search:', error);
    throw error;
  }
}

export async function apiHotelSearch(
  body: API.SearchDto,
  options?: RequestOptions
) {
  const { searchFields, pagination } = body;
  // Tạo filter từ searchFields
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
          // Mapping từng filter dựa trên key tương ứng
          if (field.key === 'code') {
            filters['filter[code][_icontains]'] = field.value;
          } else if (field.key === 'short_name') {
            filters['filter[short_name][_icontains]'] = field.value;
          } else if (field.key === 'status') {
            filters['filter[status][_eq]'] = field.value;
					} else if (field.key === 'full_name') {
							filters['filter[full_name][_icontains]'] = field.value;
					} else if (field.key === 'hotline') {
						filters['filter[hotline][_icontains]'] = field.value;
					} else if (field.key === 'fo_phone') {
						filters['filter[hotline][_icontains]'] = field.value;
					} else if (field.key === 'email') {
						filters['filter[email][_icontains]'] = field.value;
					} else if (field.key === 'website') {
						filters['filter[website][_icontains]'] = field.value;
					} else if (field.key === 'country') {
						filters['filter[country][code][_eq]'] = field.value;
					} else if (field.key === 'provinceCode') {
						filters['filter[province][code][_eq]'] = field.value;
					} else if (field.key === 'districtCode') {
						filters['filter[district][code][_eq]'] = field.value;
					} else if (field.key === 'wardCode') {
						filters['filter[ward][code][_eq]'] = field.value;
					} else if (field.key === 'createdBy') {
						filters['filter[created_by][_in]'] = field.value;
					} else if (field.key === 'modifiedBy') {
						filters['filter[modified_by][_in]'] = field.value;
					} else if (field.key === 'createdDate' && typeof field.value === 'string') {
						const dates = field.value.split(',');
  					filters['filter[created_date][_gte]'] = `${dates[0].trim()}`;
  					filters['filter[created_date][_lte]'] = `${dates[1].trim()}`;
					} else if (field.key === 'modifiedAt' && typeof field.value === 'string') {
						const dates = field.value.split(',');
  					filters['filter[modified_date][_gte]'] = `${dates[0].trim()}`;
  					filters['filter[modified_date][_lte]'] = `${dates[1].trim()}`;
          } else if (field.key === 'contact_extend') {
						// filters['filter[contact_extend][value][_icontains]'] = field.value;
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
    queryString += `&limit=${limit}&offset=${offset}&meta=*`;
  }

  const url = `/api/cms/items/hotel?${queryString}`;

  try {
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

export async function createHotel(data: any, options?: RequestOptions) {
	try {
		const response = await request(`/api/cms/items/hotel`,
			{
				method: 'POST',
				data: data,
				...(options || {}),
			}
		);
		return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}

export async function getHotelByID(id: string, options?: RequestOptions) {
	try {
		const response = await request(`/api/cms/items/hotel/${id}?fields[]=*.*`,
			{
				method: 'GET',
				...(options || {}),
			}
		);
		return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}

export async function updateHotel(id: string, data: any, options?: RequestOptions) {
	try {
		const response = await request(`/api/cms/items/hotel/${id}`,
			{
				method: 'PATCH',
				data: data,
				...(options || {}),
			}
		);
		return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}

export async function deleteHotel(data: any, options?: RequestOptions) {
	try {
		const response = await request(`/api/cms/items/hotel`,
			{
				method: 'DELETE',
				data: data,
				...(options || {}),
			}
		);
		return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}

export async function apiImportFileHotel(file: File, options?: RequestOptions) {
	try {
		const formData = new FormData();
    formData.append('file', file);

		const response = await request(`/api/cms/app-api/import-excel/hotel`,
			{
				method: 'POST',
				data: formData,
      	responseType: 'blob',
				...(options || {}),
			}
		);
		return response;
  } catch (error) {
    console.error('Error create service:', error);
    throw error;
  }
}

export async function apiRoomTypeSearch(
  body: API.SearchDto,
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
          if (field.key === 'code') {
            filters['filter[code][_icontains]'] = field.value;
          } else if (field.key === 'name') {
            filters['filter[name][_icontains]'] = field.value;
          } else if (field.key === 'hotelId') {
            filters['filter[hotel_id][_in]'] = field.value;
          } else if (field.key === 'status') {
            filters['filter[status][_eq]'] = field.value;
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
    queryString = `${
      queryString ? '&' : ''
    }${queryString}&limit=${limit}&offset=${offset}&meta=*`;
  }

  const url = `/api/cms/items/room_type?fields[]=*.*${queryString}`;

  try {
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

export async function apiPackageServiceSearch(
  body: API.SearchDto,
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
          if (field.key === 'code') {
            filters['filter[code][_icontains]'] = field.value;
          } else if (field.key === 'full_name') {
            filters['filter[name][_icontains]'] = field.value;
          } else if (field.key === 'hotelId') {
            filters['filter[hotel][_in]'] = String(field.value);
          } else if (field.key === 'status') {
            filters['filter[status][_eq]'] = field.value;
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
    queryString = `${
      queryString ? '&' : ''
    }${queryString}&limit=${limit}&offset=${offset}&meta=*`;
  }

  const url = `/api/cms/items/package_plan?fields[]=*.*&fields[]=service.service_id.*${queryString}`;

  try {
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

export async function apiHotelList(
  body: API.SearchDto,
  options?: RequestOptions
) {
  const filters: { [key: string]: any } = {};
  filters['filter[status][_ncontains]'] = 'archived';
  let queryString = new URLSearchParams(filters).toString();

  const url = `/api/cms/items/hotel?${queryString}`;

  try {
    const response = await request(url, {
			method: 'GET',
    	...options,
    });
    return response;
  } catch (error) {
    console.error('Error during hotel search:', error);
    throw error;
  }
}

export async function apiMarketSegmentList(
	hotelIDs: string,
  options?: RequestOptions
) {

  const url = `/api/cms/items/market_segment?fields[]=hotel.*,code,name,id&filter[hotel][id][_in]=${hotelIDs}`;

  try {
    const response = await request(url, {
			method: 'GET',
    	...options,
    });
    return response;
  } catch (error) {
    console.error('Error during hotel search:', error);
    throw error;
  }
}

export async function apiRoomTypeList(
	hotelIDs: string,
  options?: RequestOptions
) {
  const url = `/api/cms/items/room_type?fields[]=id,code,name,hotel_id.*&filter[hotel_id][id][_in]=${hotelIDs}`;

  try {
    const response = await request(url, {
			method: 'GET',
    	...options,
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy roomtype:', error);
    throw error;
  }
}


export async function apiServiceList(
	hotelIDs: string,
  options?: RequestOptions
) {
  const url = `/api/cms/items/service?fields[]=code,name,hotel.*&filter[hotel][id][_in]=${hotelIDs}`;

	try {
		const response = await request(url, {
			method: 'GET',
			...options,
		});
		return response;
  } catch (error) {
    console.error('Lỗi khi lấy roomtype:', error);
    throw error;
  }
}