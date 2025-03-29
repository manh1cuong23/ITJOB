import { request, RequestOptions } from '@/utils/request';
import {
  convertToPageData,
  mapViewRoomInfoList,
} from '../transforms/mapResponse';
import { hotelDataArray } from '@/mocks/listAllotment';
import dayjs from 'dayjs';
import { convertToYYYYMMDD } from '@/utils/dateUtil';

export async function apiAllotmentSearch(
  body: API.SearchDto,
  options?: RequestOptions
) {
  const today = dayjs();
  const defaultStartDate = today.format('YYYY-MM-DD');
  const defaultEndDate = today.add(30, 'day').format('YYYY-MM-DD');
  const { pagination, searchFields, sortFields } = body;
  console.log(searchFields);
  // Tìm kiếm thông tin từ searchFields
  const hotelId =
    searchFields
      ?.find(field => field.key === 'hotelId')
      ?.value?.toString()
      .replace(/^,+|,+$/g, '') || '';
  const fromToField = searchFields?.find(field => field.key === 'from_to');
  // const fromDate = fromToField && Array.isArray(fromToField.value) ? convertToYYYYMMDD(fromToField.value[0]) : defaultStartDate;
  // const toDate = fromToField && Array.isArray(fromToField.value) ? convertToYYYYMMDD(fromToField.value[1]) : defaultEndDate;
  const fromDate =
    fromToField && Array.isArray(fromToField.value)
      ? fromToField.value[0]
      : defaultStartDate;
  const toDate =
    fromToField && Array.isArray(fromToField.value)
      ? fromToField.value[1]
      : defaultEndDate;
  console.log(searchFields);
  // Định dạng dữ liệu gửi lên server
  const formattedParams = {
    hotelId,
    fromDate,
    toDate,
    taCode: 'FOURIER',
    roomTypeCode:
      searchFields
        ?.find(field => field.key === 'roomTypeCode')
        ?.value?.toString() || '',
    allotmentNo:
      searchFields?.find(field => field.key === 'allotmentNo')?.value || '',
    packageCode:
      searchFields
        ?.find(field => field.key === 'packageCode')
        ?.value?.toString() || '',
    keyword: searchFields?.find(field => field.key === 'keyword')?.value || '',
    pageSize: (pagination && pagination?.pageSize) || 10,
    pageNumber: (pagination && pagination.pageNum - 1) || 0,
    isPaging: false,
    sortField: sortFields?.field || 'hotelId',
    sortOrder: sortFields?.order || 'DESC',
  };

  try {
    const response = await request(
      `/inv/api/cm/inventory/ta-available/search`,
      {
        method: 'GET',
        params: formattedParams, // gửi dữ liệu dưới dạng query params
        ...(options || {}),
      }
    );
    return convertToPageData(response, true);
  } catch (error) {
    console.error('Error during allotment search:', error);
    throw error;
  }
}

export async function apiRoomInfoSearch(
  body: API.SearchDto,
  options?: RequestOptions
) {
  const today = dayjs();
  const defaultStartDate = today.format('YYYY-MM-DD');
  const defaultEndDate = today.add(1, 'day').format('YYYY-MM-DD');
  const { pagination, searchFields, sortFields } = body;

  // Tìm kiếm thông tin từ searchFields
  const hotelId =
    searchFields
      ?.find(field => field.key === 'hotelId')
      ?.value?.toString()
      .replace(/^,+|,+$/g, '') || 'N/A';
  const fromToField = searchFields?.find(field => field.key === 'dateRange');
  const fromDate =
    fromToField && Array.isArray(fromToField.value)
      ? fromToField.value[0]
      : defaultStartDate;
  const toDate =
    fromToField && Array.isArray(fromToField.value)
      ? fromToField.value[1]
      : defaultEndDate;

  // Định dạng dữ liệu gửi lên server
  const formattedParams = {
    hotelId: hotelId,
    fromDate,
    toDate,
    taCode: 'FOURIER',
    roomTypeCode:
      searchFields
        ?.find(field => field.key === 'roomTypeCode')
        ?.value?.toString() || '',
    allotmentNo:
      searchFields?.find(field => field.key === 'allotmentNo')?.value || '',
    packageCode:
      searchFields
        ?.find(field => field.key === 'packageCode')
        ?.value?.toString() || '',
    keyword: searchFields?.find(field => field.key === 'keyword')?.value || '',
    pageSize: (pagination && pagination?.pageSize) || 10,
    pageNumber: (pagination && pagination.pageNum - 1) || 0,
    isPaging: false,
    sortField: sortFields?.field || 'hotelId',
    sortOrder: sortFields?.order || 'DESC',
  };

  try {
    const response = await request(
      `/inv/api/cm/inventory/ta-available/search`,
      {
        method: 'GET',
        params: formattedParams,
        ...(options || {}),
      }
    );
    return mapViewRoomInfoList(response);
  } catch (error) {
    console.error('Error during allotment search:', error);
    throw error;
  }
}
export function mockData(): Promise<any> {
  const body: API.ResOp = {
    data: hotelDataArray,
    isSuccess: true,
  };
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(convertToPageData(body, true)); // Gọi hàm chuyển đổi dữ liệu
    }, 500); // Giả lập delay 1 giây
  });
}

export async function apiHotelList(options?: RequestOptions) {
  const filters: { [key: string]: any } = {};
  filters['filter[status][_icontains]'] = 'published';
  let queryString = new URLSearchParams(filters).toString();
	const url = `/api/cms/items/hotel?${queryString}`;

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
export async function apiPackageList(hotelId?: string, options?: RequestOptions) {
  const filters: { [key: string]: any } = {};
  filters['filter[status][_icontains]'] = 'published';
  if (hotelId) {
		filters['filter[hotel][id][_eq]'] = hotelId;
	}

  let queryString = new URLSearchParams(filters).toString();
	const url = `/api/cms/items/package_plan?${queryString}&fields[]=*.*&fields[]=service.service_id.*`;

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
export async function apiPackageListbyHotel(
  body: API.searchObj[],
  options?: RequestOptions
) {
  const searchFields = body;
  // Định dạng dữ liệu gửi lên server
  const formattedParams = {
    hotelIds:
      searchFields?.find(field => field.key === 'hotelIds')?.value || '',
    fromDate:
      searchFields?.find(field => field.key === 'fromDate')?.value || '',
    toDate: searchFields?.find(field => field.key === 'toDate')?.value || '',
    taCode: 'FOURIER',
  };
  return await request<API.ResOp>(
    `/inv/api/cm/inventory/ta-available/get-packages`,
    {
      method: 'GET',
      params: formattedParams,
      ...(options || {}),
    }
  );
}
export async function apiRoomTypeByHotelId(
  hotelId?: string,
  options?: RequestOptions
) {
  type FormatedParams = {
		status: { _contains: string };
		hotel_id?: { _in: string[] }; // Thuộc tính tùy chọn
	};

	const formatedParams: FormatedParams = {
		status: { _contains: 'published' },
	};
	if (hotelId) {
		formatedParams.hotel_id = { _in: hotelId.split(',') };
	}
	const url = `/api/cms/items/room_type?fields[]=*.*&filter=${JSON.stringify(formatedParams)}`;

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
export async function apiBookingView(id: string | number) {
  return await request<API.ResOp>(`/bev2/api/booking/booking/find/${id}`, {
    method: 'GET',
    ...{},
  });
}

export async function apiRoomAvailability(
  body: API.searchObj[],
  options?: RequestOptions
) {
  const searchFields = Array.isArray(body) ? body : [];

  const fromToValue = searchFields?.find(
    field => field.key === 'from_to'
  )?.value;
  // Định dạng dữ liệu gửi lên server
  const formattedParams = {
    hotelId: searchFields?.find(field => field.key === 'hotelId')?.value || '',
    fromDate: Array.isArray(fromToValue) ? fromToValue[0] : '',
    toDate: Array.isArray(fromToValue) ? fromToValue[1] : '',
    roomTypeCodes:
      searchFields?.find(field => field.key === 'roomTypeCodes')?.value || '',
  };

  return await request<API.ResOp>(
    `/inv/api/cm/inventory/hotel-available/search?`,
    {
      method: 'GET',
      params: formattedParams,
      ...(options || {}),
    }
  );
}
