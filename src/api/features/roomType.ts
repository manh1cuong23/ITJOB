import { request, RequestOptions } from '@/utils/request';
export async function getAllRoomType(options?: RequestOptions) {
	try {
		const response = await request(
			`/bev2/api/crs/room-type/search`,
			{
				method: 'POST',
				data: {
					pagination: {
						pageIndex: 1,
						pageSize: 100,
						isAll: true,
					},
					filter: {},
				},
				...(options || {}),
			}
		);
		return response;
  } catch (error) {
    console.error('Error during room type search:', error);
    throw error;
  }
}

export async function getRoomTypeByHotelId(
  hotelId: string[] | string | null,
  options?: RequestOptions
) {
  const formatedParams = {
    hotel: { hotel_id: { _in: [hotelId] } },
  };
	try {
		const response = await request(
			`/api/cms/items/room_type?fields[]=code,id,name&filter=${JSON.stringify(formatedParams)}`,
			{
				method: 'GET',
				...(options || {}),
			}
		);
		return response;
  } catch (error) {
    console.error('Lỗi khi lấy roomtype:', error);
    throw error;
  }
}

export async function getRoomTypeByHotelId2(
  hotelId: string[] | string | null,
  options?: RequestOptions
) {
  const formatedParams = {
    hotel_id: { _in: [hotelId] },
  };
	try {
		const response = await request(
			`/api/cms/items/room_type?fields[]=code,id,name&filter=${JSON.stringify(formatedParams)}`,
			{
				method: 'GET',
				...(options || {}),
			}
		);
		return response;
  } catch (error) {
    console.error('Lỗi khi lấy roomtype:', error);
    throw error;
  }
}

export async function getRoomTypeList(
  options?: RequestOptions
) {
  try {
		const response = await request(
			`/api/cms/items/room_type?fields[]=code,id,name`,
			{
				method: 'GET',
				...(options || {}),
			}
		);
		return response;
  } catch (error) {
    console.error('Lỗi khi lấy roomtype:', error);
    throw error;
  }
}

export async function getRoomTypeByHotelID(
  hotelId: string,
  options?: RequestOptions
) {
	try {
		const response = await request(
			`/api/cms/items/room_type?filter={ "hotel_id": { "id": { "_in": ["${hotelId}"] } }, "status": { "_eq": "published" } }`,
			{
				method: 'GET',
				...(options || {}),
			}
		);
		return response;
  } catch (error) {
    console.error('Error during guest info search:', error);
    throw error;
  }
}
