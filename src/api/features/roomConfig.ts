import { request, RequestOptions } from '@/utils/request';
import { Buffer } from "buffer";
import { convertToPageRoomAvailability, convertToPageRoomRate } from '../transforms/mapResponse';
import { IFilter } from './booking';

export async function getRoomConfigByHotel(
  hotelId: string,
  options?: RequestOptions
) {
	const url = `/api/cms/items/room_configuration?fields[]=*.*.*&filter[hotel][_eq]=${hotelId}`;

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

export async function updateRoomConfig(
  id: string,
	data: any,
  options?: RequestOptions
) {
	const url = `api/cms/items/room_configuration/${id}`;

	try {
    // Gửi request
    const response = await request(url, {
			method: 'PATCH',
			data: data,
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during guest info search:', error);
    throw error;
  }
}

export async function createRoomConfig(
	data: any,
  options?: RequestOptions
) {
	const url = `api/cms/items/room_configuration`;

	try {
    // Gửi request
    const response = await request(url, {
			method: 'POST',
			data: data,
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during guest info search:', error);
    throw error;
  }
}

export async function apiImportFile(
	hotelId: any,
	file: File,
	options?: RequestOptions
) {
	// try {
	// 	const formData = new FormData();
	// 	formData.append('file', file);
	// 	formData.append('hotel_id', hotelId);

	// 	const response = await request(`/api/cms/app-api/import-excel/room-configuration`, {
	// 		method: 'POST',
	// 		data: formData,
	// 		responseType: 'blob',
	// 		...(options || {}),
	// 	});
	// 	return response;
	const formData = new FormData();
	formData.append('file', file);
	formData.append('hotel_id', hotelId);

	try {
		const url = `${import.meta.env.VITE_BASE_URL}/api/cms/app-api/import-excel/room-configuration`;
		const fetchOptions: RequestInit = {
      method: "POST",
      body: formData,
      ...options,
    };
		const res = await fetch(url, fetchOptions);
		const xJsonBase64 = res.headers.get('X-Json-Base64');
		let decodedData;

		if (xJsonBase64 !== null) {
			const decodedString = Buffer.from(xJsonBase64, "base64").toString();
			decodedData = JSON.parse(decodedString);
		}

		const responseBody = await res.blob();
		return {file: responseBody, data: decodedData};
	} catch (error) {
		console.error('Error during special service search:', error);
		throw error;
	}
}

export async function apiRoomAvailabilitySearch(
  body: API.SearchDto,
	isExport?: boolean,
  options?: RequestOptions
) {
	const filters: { [key: string]: any } = {};
	const { searchFields, pagination } = body;
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
  					filters['from'] = `${dates[0].trim()}`;
  					filters['to'] = `${dates[1].trim()}`;
          } else if (field.key === 'hotelId') {
            filters['hotel'] = field.value;
          } else if (field.key === 'marketSegment' && field.value !== 'N/A') {
            filters['marketSetment'] = field.value;
          } else if (field.key === 'roomTypeCodes') {
            filters['roomType'] = field.value;
          }
        }
      });
  }
  try {
    const response = await request(
      `/api/cms/app-api/room-availability/by-hotel`,
      {
        method: 'POST',
				data: filters,
        ...(options || {}),
      }
    );

    return convertToPageRoomAvailability(response, true);
  } catch (error) {
    console.error('Error during allotment search:', error);
    throw error;
  }
}

export async function getUserByMarketSegmentID(
  id: number,
  options?: RequestOptions
) {
	const filtersAnd: IFilter[] = [];
  if (id) {
		filtersAnd.push({
			propertyValue: [id],
			propertyName: 'marketSegmentId',
			propertyType: 'number',
			operator: 'In',
		});
	}
	const filterGroup = [];

  if (filtersAnd.length > 0) {
    filterGroup.push({
      filters: filtersAnd,
      condition: 'And',
    });
  }

	const formatedBody = {
    filter: {
      filterGroup: filterGroup, // Sử dụng filterGroup đã xác định
      condition: 'And',
    },
  };
  try {
    const response = await request(
      `/auth/api/permission/user-market-segment/search`,
      {
        method: 'POST',
				data: formatedBody,
        ...(options || {}),
      }
    );

    return response;
  } catch (error) {
    console.error('Error during allotment search:', error);
    throw error;
  }
}