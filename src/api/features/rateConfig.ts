import { request, RequestOptions } from '@/utils/request';
import { Buffer } from "buffer";
import {
  convertToPageDataMaster,
  convertToResponseBooking,
} from '../transforms/mapResponse';

// export async function apiRateConfigSearch(
//   body: API.SearchDto,
//   options?: RequestOptions
// ) {
//   const { searchFields, pagination } = body;
//   console.log(searchFields);
//   const filters: { [key: string]: any } = {};
//   if (searchFields) {
//     Array.isArray(searchFields) &&
//       searchFields.forEach(field => {
//         if (
//           field.value !== undefined &&
//           field.value !== null &&
//           field.value !== 0 &&
//           field.value !== ''
//         ) {
//           if (field.key === 'rate_code') {
//             filters['filter[rate_code][_icontains]'] = field.value;
//           } else if (field.key === 'full_name') {
//             filters['filter[name][_icontains]'] = field.value;
//           } else if (field.key === 'hotelId') {
//             filters['filter[hotel][_in]'] = String(field.value);
//           } else if (field.key === 'status') {
//             filters['filter[status][_eq]'] = field.value;
//           }
//         }
//       });
//   }
//   filters['filter[status][_ncontains]'] = 'archived';
//   // Tạo query string từ filters
//   let queryString = new URLSearchParams(filters).toString();

//   // Thêm phân trang vào query string
//   if (pagination) {
//     const { pageNum, pageSize } = pagination;
//     const limit = pageSize || 10; // Mặc định là 10
//     const offset = (pageNum - 1) * limit; // Tính toán offset dựa trên pageNum
//     queryString = `${
//       queryString ? '&' : ''
//     }${queryString}&limit=${limit}&offset=${offset}&meta=*`;
//   }

//   const url = `/api/cms/items/rate_configuration?fields[]=*.*&fields[]=rate_settings.rate_configuration_setting_item_id.*&fields[]=rate_adjustement.rate_configuration_adjustement_id.item_daytype.adjustement_daytype_id.*&fields[]=rate_adjustement.rate_configuration_adjustement_id.item_season.adjustement_season_id.*&fields[]=rate_adjustement.rate_configuration_adjustement_id.item_occupancy.adjustement_occupancy_id.*${queryString}`;

//   try {
//     // Gửi request
//     const response: any = await request(url, {
//       ...options,
//     });
//     return convertToPageDataMaster(response);
//   } catch (error) {
//     console.error('Error during hotel search:', error);
//     throw error;
//   }
// }

export async function getRateConfigByHotel(
  hotelId: string,
  options?: RequestOptions
) {
	const url = `/api/cms/items/rate_configuration?fields[]=*.*&fields[]=rate_settings.rate_configuration_setting_item_id.*&fields[]=rate_adjustement.rate_configuration_adjustement_id.item_daytype.adjustement_daytype_id.*&fields[]=rate_adjustement.rate_configuration_adjustement_id.item_season.adjustement_season_id.*&fields[]=rate_adjustement.rate_configuration_adjustement_id.item_occupancy.adjustement_occupancy_id.*&fields[]=rate_adjustement.rate_configuration_adjustement_id.item_daytype.*&fields[]=rate_adjustement.rate_configuration_adjustement_id.item_season.*&=rate_adjustement.rate_configuration_adjustement_id.item_occupancy.*&fields[]=rate_settings.rate_configuration_setting_item_id.rate_code.*&fields[]=rate_settings.rate_configuration_setting_item_id.room_type.*&fields[]=rate_settings.rate_configuration_setting_item_id.package_plan.*&fields[]=rate_adjustement.rate_configuration_adjustement_id.*&fields[]=rate_adjustement.rate_configuration_adjustement_id.item_occupancy.*&filter[hotel][_eq]=${hotelId}`;

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

export async function updateRateConfig(data: any, id: string, options?: RequestOptions) {
	const url = `/api/cms/items/rate_configuration/${id}`;

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

export async function createRateConfig(data: any, options?: RequestOptions) {
	const url = `/api/cms/items/rate_configuration`;

	try {
    // Gửi request
    const response = await request(url, {
			method: 'POST',
			data: data,
      ...options,
    });
    return response;
  } catch (error) {
    console.error('Error during update guest info:', error);
    throw error;
  }
}

export async function apiImportFile(
	hotelId: any,
	file: File,
	options?: RequestOptions
) {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('hotel_id', hotelId);

	try {
		// const response = await request(`/api/cms/app-api/import-excel/rate-configuration`, {
		// 	method: 'POST',
		// 	data: formData,
		// 	responseType: 'blob',
		// 	...(options || {}),
		// });
		const url = `${import.meta.env.VITE_BASE_URL}/api/cms/app-api/import-excel/rate-configuration`;
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
