import { request, RequestOptions } from '@/utils/request';
import {
	convertToPageData,
	convertToPageDataMaster,
	convertToPageRoomRate,
} from '../transforms/mapResponse';
import dayjs from 'dayjs';

export async function apiRoomRateSearch(
  body: API.SearchDto,
	isExport?: boolean,
  options?: RequestOptions
) {
	const filters: { [key: string]: any } = {};
	const { searchFields, pagination } = body;
  // Tìm kiếm thông tin từ searchFields
  if (searchFields) {
    Array.isArray(searchFields) &&
      searchFields.forEach(field => {
        if (
          field.value !== undefined &&
          field.value !== null &&
          field.value !== 0 &&
          field.value !== ''
        ) {
          if (field.key === 'from_to' && typeof field.value === 'string') {
						const dates = field.value.split(',');
  					filters['filter[date][_gte]'] = `${dates[0].trim()}T12:00:00`;
  					filters['filter[date][_lte]'] = `${dates[1].trim()}T12:00:00`;
          } else if (field.key === 'hotelId') {
            filters['filter[rate_plan_id][hotel][id][_eq]'] = field.value;
          } else if (field.key === 'marketSegment') {
            filters['filter[rate_plan_id][market_segment][id][_in]'] = field.value;
          } else if (field.key === 'rateCode') {
            filters['filter[rate_plan_id][rate_code][id][_in]'] = field.value;
          } else if (field.key === 'roomType') {
            filters['filter[room_type][id][_in]'] = field.value;
          } else if (field.key === 'packagePlan') {
            filters['filter[package_plan][id][_in]'] = field.value;
          }
        }
      });
  }
	let queryString = new URLSearchParams(filters).toString();
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

  try {
    const response = await request(
      `/api/cms/items/rate_plan_room_detail?fields[]=*.*.*${queryString}`,
      {
        method: 'GET',
        ...(options || {}),
      }
    );
    return convertToPageRoomRate(response, true);
  } catch (error) {
    console.error('Error during allotment search:', error);
    throw error;
  }
}

export async function apiChangeRate(data: any, options?: RequestOptions) {
	try {
		const response = await request(
			`/api/cms/app-api/room-rate/change-rate`,
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