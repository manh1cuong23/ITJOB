import { request, RequestOptions } from '@/utils/request';
import {
  convertToPageData,
  convertToResponseBooking,
} from '../transforms/mapResponse';
import { BOOKED_BY } from '@/constants/booking';

export interface IFilter {
  propertyValue: string | string[] | boolean | number | number[];
  propertyName: string;
  propertyType: string;
  operator: '==' | 'Contains' | 'In';
}

export async function apiBookingSearch(
  body: API.SearchDto,
  options?: RequestOptions
) {
  const { pagination, searchFields } = body;

  // Tạo 2 nhóm filterGroup: 1 cho 'Or' và 1 cho 'And'
  const filtersOr: IFilter[] = [];
  const filtersAnd: IFilter[] = [];
  const formattedFields: any = [];
  if (searchFields) {
    Array.isArray(searchFields) &&
      searchFields.forEach(field => {
        // Chỉ xử lý khi field.value có giá trị
        if (
          field.value !== undefined &&
          field.value !== null &&
          field.value !== ''
        ) {
          if (field.key === 'arr_dept') {
            const arrDeptArray =
              typeof field.value === 'string'
                ? field.value.split(',') // Tách chuỗi thành mảng
                : Array.isArray(field.value)
                ? field.value
                : [];

            // Tách arr_dept thành arrivalDate và departureDate
            formattedFields.push(
              { key: 'arrivalDate', value: arrDeptArray[0], operator: '>=' },
              { key: 'departureDate', value: arrDeptArray[1], operator: '<=' }
            );
          } else if (field.key === 'createdDate') {
            const createdDateArray =
              typeof field.value === 'string'
                ? field.value.split(',') // Tách chuỗi thành mảng
                : Array.isArray(field.value)
                ? field.value
                : [];

            formattedFields.push(
              {
                key: 'createdDate',
                value: createdDateArray[0],
                operator: '>=',
              },
              { key: 'createdDate', value: createdDateArray[1], operator: '<=' }
            );
					} else if (field.key === 'dateApproval') {
            const createdDateArray =
              typeof field.value === 'string'
                ? field.value.split(',') // Tách chuỗi thành mảng
                : Array.isArray(field.value)
                ? field.value
                : [];

            formattedFields.push(
              {
                key: 'dateApproval',
                value: createdDateArray[0],
                operator: '>=',
              },
              { key: 'dateApproval', value: createdDateArray[1], operator: '<=' }
            );
          } else if (field.key === 'createdBy' && Array.isArray(field.value)) {
            // Lặp qua từng đối tượng trong mảng createdBy
            const createdByNames = field.value.map(userId => {
              // Tìm tên tương ứng từ BOOKED_BY
              const bookedByUser = BOOKED_BY.find(
                user => user.value === Number(userId)
              );
              return bookedByUser ? bookedByUser.label : 'Unknown'; // Gán tên mặc định nếu không tìm thấy
            });
            // Thêm điều kiện 'In' cho createdByName
            if (createdByNames.length > 0) {
              filtersAnd.push({
                propertyValue: createdByNames,
                propertyName: 'createdBy', // Giả định bạn có một trường 'createdByName'
                propertyType: 'string', // Thay đổi type nếu cần
                operator: 'In',
              });
            }
          } else if (field.key === 'channel' && field.value !== undefined) {
            filtersAnd.push({
              propertyValue: Number(field.value),
              propertyName: 'channel',
              propertyType: 'number',
              operator: '==',
            });
          } else if (field.key === 'hotelId') {
            let propertyValue;
            if (typeof field.value === 'string') {
              propertyValue = field.value.split(',');
            } else if (Array.isArray(field.value)) {
              propertyValue = field.value;
            } else {
              propertyValue = [String(field.value)];
            }
            filtersAnd.push({
              propertyValue: propertyValue,
              propertyName: 'cmHotelId',
              propertyType: 'string',
              operator: 'In',
            });
          } else if (field.key === 'bookingSourceCode') {
            let propertyValue;
            if (typeof field.value === 'string') {
              propertyValue = field.value.split(',');
            } else if (Array.isArray(field.value)) {
              propertyValue = field.value;
            } else {
              propertyValue = [String(field.value)];
            }
            filtersAnd.push({
              propertyValue: propertyValue,
              propertyName: 'bookingSourceCode',
              propertyType: 'string',
              operator: 'In',
            });
          } else if (
            field.key === 'bookingStatus' ||
            field.key === 'ChannelStatus'
          ) {
            let propertyValue: number[];
            if (typeof field.value === 'string') {
              propertyValue = field.value
                .split(',')
                .map(v => Number(v.trim()))
                .filter(v => !isNaN(v));
            } else if (Array.isArray(field.value)) {
              propertyValue = field.value
                .map(v => Number(v))
                .filter(v => !isNaN(v));
            } else {
              propertyValue = [Number(field.value)].filter(v => !isNaN(v));
            }
            filtersAnd.push({
              propertyValue: propertyValue,
              propertyName: field.key,
              propertyType: 'number',
              operator: 'In',
            });
          } else if (field.key === 'channelName') {
            let propertyValue;
            if (typeof field.value === 'string') {
              propertyValue = field.value
                .split(',')
                .map(val => Number(val.trim()));
            } else if (Array.isArray(field.value)) {
              propertyValue = field.value.map(val => Number(val));
            } else {
              propertyValue = [Number(field.value)];
            }
            filtersAnd.push({
              propertyValue: propertyValue,
              propertyName: 'channel',
              propertyType: 'number',
              operator: 'In',
            });
          } else if (field.key === 'userApproval') {
            let propertyValue;
            if (typeof field.value === 'string') {
              propertyValue = field.value.split(',');
            } else if (Array.isArray(field.value)) {
              propertyValue = field.value;
            } else {
              propertyValue = [String(field.value)];
            }
            filtersAnd.push({
              propertyValue: propertyValue,
              propertyName: 'userApproval',
              propertyType: 'string',
              operator: 'In',
            });
          } else if (field.key === 'BookingGuestInfos.Guest.FullName') {
            filtersAnd.push({
              propertyValue: field.value,
              propertyName: field.key,
              propertyType: 'string',
              operator: 'Contains',
            });
          } else {
            // Các field khác giữ nguyên
            formattedFields.push(field);
          }
        }
      });

  }
  // Chuyển đổi searchFields thành định dạng filter
  formattedFields?.forEach((field: any) => {
    if (field.key === 'keyword') {
      // Nếu propertyKey là 'keyword', tạo filter cho BookingNo, hotelId, guestName với condition 'Or'
      filtersOr.push(
        {
          propertyValue: field.value,
          propertyName: 'BookingNo',
          propertyType: 'string',
          operator: 'Contains',
        },
        {
          propertyValue: field.value,
          propertyName: 'Hotel.FullName',
          propertyType: 'string',
          operator: 'Contains',
        },
        {
          propertyValue: field.value,
          propertyName: 'BookingGuestInfos.Guest.FullName',
          propertyType: 'string',
          operator: 'Contains',
        }
      );
    } else {
      const operator = Array.isArray(field.value)
        ? 'In'
        : field.operator || '==';
      const propertyType =
        field.key.includes('Date') || field.key.includes('Time')
          ? 'date'
          : Array.isArray(field.value)
          ? typeof field.value[0] === 'number'
            ? 'number'
            : 'string'
          : typeof field.value === 'number'
          ? 'number'
          : 'string';
      // Đối với các trường hợp thông thường, thêm filter vào nhóm 'And'
      if (field.value === '' || !field.value) {
        return;
      }
      filtersAnd.push({
        propertyValue: field.value,
        propertyName: field.key,
        propertyType: propertyType,
        operator: operator,
      });
    }
  });

  // Tạo filterGroup dựa trên điều kiện 'And' và 'Or'
  const filterGroup = [];

  if (filtersAnd.length > 0) {
    filterGroup.push({
      filters: filtersAnd,
      condition: 'And',
    });
  }

  if (filtersOr.length > 0) {
    filterGroup.push({
      filters: filtersOr,
      condition: 'Or',
    });
  }

  const formatedBody = {
    pagination: {
      pageIndex: pagination && pagination.pageNum,
      pageSize: pagination && pagination.pageSize,
      isAll: false,
    },
    filter: {
      filterGroup: filterGroup, // Sử dụng filterGroup đã xác định
      condition: 'And',
    },
  };

  try {
    const response = await request(`/bev2/api/booking/booking/search`, {
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

export async function apiBookingGuestSearch(
  fullName: string,
  pageNumber?: number,
  options?: RequestOptions
) {
  const formatedBody = {
    pagination: {
      pageIndex: pageNumber || 2147483647,
      pageSize: 10,
      isAll: false,
    },
    filter: {
      filterGroup: [
        {
          filters: [
            {
              propertyValue: fullName,
              propertyName: 'FullName',
              propertyType: 'string',
              operator: 'Contains',
            },
          ],
          condition: 'And',
        },
      ],
    },
  };

  try {
    const response = await request(`/bev2/api/booking/guest-info/search`, {
      // url: 'http://10.0.170.128:6004/api/booking/booking/search',
      method: 'POST',
      data: formatedBody,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during booking search:', error);
    throw error;
  }
}

export async function apiSpecialServiceList(
  hotelId: string | null,
  options?: RequestOptions
) {
  const formatedBody = {
    pagination: {
      pageIndex: 2147483647,
      pageSize: 2147483647,
      isAll: true,
    },
    filter: {
      filterGroup: [
        {
          filters: [
            {
              propertyValue: hotelId,
              propertyName: 'hotelId',
              propertyType: 'string',
              operator: 'Contains',
            },
          ],
          condition: 'And',
        },
      ],
    },
  };

  try {
    const response = await request(`/bev2/api/booking/extra-service/search`, {
      // url: 'http://10.0.170.128:6004/api/booking/booking/search',
      method: 'POST',
      data: formatedBody,
      ...(options || {}),
    });
    return convertToPageData(response);
  } catch (error) {
    console.error('Error during special service search:', error);
    throw error;
  }
}

export async function apiBookingCreate(
  body: API.BookingCreateDto,
  options?: RequestOptions
) {
  try {
    const response = await request(`/bev2/api/booking/booking/create`, {
      // url: 'http://10.0.170.128:6004/api/booking/booking/search',
      method: 'POST',
      data: body,
      ...(options || {}),
    });
    return convertToPageData(response);
  } catch (error) {
    console.error('Error during special service search:', error);
    throw error;
  }
}

export async function apiBookingUpdate(
  body: API.BookingUpdateDto,
  options?: RequestOptions
) {
  try {
    const response = await request(`/bev2/api/booking/booking/update`, {
      // url: 'http://10.0.170.128:6004/api/booking/booking/search',
      method: 'PUT',
      data: body,
      ...(options || {}),
    });
    return convertToPageData(response);
  } catch (error) {
    console.error('Error during special service search:', error);
    throw error;
  }
}

export async function apiBookingGetById(id: number, options?: RequestOptions) {
  try {
    const response = await request(`/bev2/api/booking/booking/find/${id}`, {
      method: 'GET',
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during booking get by id:', error);
    throw error;
  }
}

export async function apiBookingReject(
  body: API.BookingRejectDto,
  options?: RequestOptions
) {
  try {
    const response = await request(
      `/bev2/api/booking/booking/cms-reject-list`,
      {
        // url: 'http://10.0.170.128:6004/api/booking/booking/search',
        method: 'POST',
        data: body,
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during special service search:', error);
    throw error;
  }
}

export async function apiBookingApprove(
  body: API.BookingRejectDto,
  options?: RequestOptions
) {
  try {
    const response = await request(
      `/bev2/api/booking/booking/cms-approval-list`,
      {
        // url: 'http://10.0.170.128:6004/api/booking/booking/search',
        method: 'POST',
        data: body,
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during special service search:', error);
    throw error;
  }
}

export async function apiBookingRejectItem(
  body: API.BookingRejectDto,
  options?: RequestOptions
) {
  try {
    const response = await request(
      `/bev2/api/booking/booking-item/cms-reject-list`,
      {
        // url: 'http://10.0.170.128:6004/api/booking/booking/search',
        method: 'POST',
        data: body,
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during special service search:', error);
    throw error;
  }
}

export async function apiBookingApproveItem(
  body: API.BookingRejectDto,
  options?: RequestOptions
) {
  try {
    const response = await request(
      `/bev2/api/booking/booking-item/cms-approval-list`,
      {
        // url: 'http://10.0.170.128:6004/api/booking/booking/search',
        method: 'POST',
        data: body,
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during special service search:', error);
    throw error;
  }
}

export async function apiGetRoomTypeById(id: number, options?: RequestOptions) {
  try {
		const response = await request(
      `/api/cms/items/room_type?fields[]=total_adult,total_child,id&filter[room_type_id]=${id}`,
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

export async function apiBookingItemCancel(
  body: API.BookingItemCancelDto,
  options?: RequestOptions
) {
  try {
    const response = await request(`/bev2/api/booking/booking-item/cancel`, {
      // url: 'http://10.0.170.128:6004/api/booking/booking/search',
      method: 'POST',
      data: body,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during cancel booking item:', error);
    throw error;
  }
}

export async function apiBookingItemListCancel(
  body: API.BookingItemListCancelDto,
  options?: RequestOptions
) {
  try {
    const response = await request(
      `/bev2/api/booking/booking-item/cancel-list`,
      {
        // url: 'http://10.0.170.128:6004/api/booking/booking/search',
        method: 'POST',
        data: body,
        ...(options || {}),
      }
    );
    return response;
  } catch (error) {
    console.error('Error during cancel booking item list:', error);
    throw error;
  }
}

export async function apiBookingVoucher(
  body: API.BookingVoucherDto,
  options?: RequestOptions
) {
  try {
    const response = await request(`/bev2/api/booking/evoucher/check`, {
      method: 'POST',
      data: body,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during cancel booking item:', error);
    throw error;
  }
}

export async function apiBookingVoucherListDetail(
  body: API.BookingVoucherDto,
  options?: RequestOptions
) {
  try {
    const response = await request(`/bev2/api/booking/evoucher/list-detail`, {
      method: 'POST',
      data: body,
      ...(options || {}),
    });
    return response;
  } catch (error) {
    console.error('Error during cancel booking item:', error);
    throw error;
  }
}
