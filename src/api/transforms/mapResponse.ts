export function convertToPageData<T>(
  baseResponse: API.ResOp,
  isFormated: boolean = false
): CORE.Response<CORE.PageData<any>> {
  if (isFormated) {
    console.log(organizeDataByRoomType(baseResponse.data));
    return {
      status: baseResponse.isSuccess,
      message: baseResponse.errors ? baseResponse.errors[0].message : '',
      result: {
        data: organizeDataByRoomType(baseResponse.data) ?? [],
        total: baseResponse.pagination?.total ?? 0,
        pageSize: baseResponse.pagination?.pageSize ?? 0,
        pageNumber: baseResponse.pagination?.pageNum ?? 1,
      },
    };
  }
  return {
    status: baseResponse.isSuccess,
    message: baseResponse.errors ? baseResponse.errors[0].message : '',
    result: {
      data: baseResponse.data ?? [],
      total: baseResponse.pagination?.total ?? 0,
      pageSize: baseResponse.pagination?.pageSize ?? 0,
      pageNumber: baseResponse.pagination?.pageNum ?? 1,
    },
  };
}

const organizeDataByRoomType = (data: any[]) => {
  const organizedData: Record<string, any> = {};

  data.forEach(item => {
    const {
      hotelName,
      roomTypeName,
      packageCode,
      allotmentNo,
      date,
      availableRooms,
      totalRooms,
      rate,
      packageName,
    } = item;

    // Tạo key dựa trên hotelName, roomTypeName, packageCode và allotmentNo
    const key = `${hotelName}-${roomTypeName}-${packageCode}-${allotmentNo}-${packageName}`;

    if (!organizedData[key]) {
      // Nếu key chưa tồn tại, khởi tạo một đối tượng cho nhóm này
      organizedData[key] = {
        hotelName,
        roomTypeName,
        packageName,
        allotmentNo,
      };
    }

    // Thêm dữ liệu vào đối tượng chính với ngày tháng
    organizedData[key][date] = {
      availableRooms,
      totalRooms,
      rate,
    };
  });

  // Chuyển organizedData từ object sang mảng để hiển thị trong bảng
  return Object.values(organizedData);
};

export function convertToPageRoomRate<T>(
  baseResponse: API.ResMaster,
  isFormated: boolean = false
): CORE.Response<CORE.PageData<any>> {
  if (isFormated) {
    return {
      status: true,
   		message: '',
    	result: {
      	data: organizeDataByRoomRate(baseResponse.data) ?? [],
      	total: baseResponse.meta?.filter_count ?? 0,
        // pageSize: baseResponse.pagination?.pageSize ?? 0,
        // pageNumber: baseResponse.pagination?.pageNum ?? 1,
      },
    };
  }
  return {
    status: true,
		message: '',
		result: {
			data: baseResponse.data ?? [],
			total: baseResponse.meta?.filter_count ?? 0,
			// pageSize: baseResponse.pagination?.pageSize ?? 0,
			// pageNumber: baseResponse.pagination?.pageNum ?? 1,
		},
  };
}

const organizeDataByRoomRate = (data: any[]) => {
  const organizedData: Record<string, any> = {};

  data.forEach(item => {
    const {
      package_plan,
      date,
      rate,
      room_type,
			rate_plan_id
    } = item;

		const formattedDate = new Date(date).toISOString().split('T')[0];
    // Tạo key dựa trên hotelName, roomTypeName, packageCode và allotmentNo
    const key = `${rate_plan_id?.market_segment?.id}-${rate_plan_id?.rate_code?.id}-${room_type?.id}-${package_plan?.id}`;

    if (!organizedData[key]) {
      organizedData[key] = {
				market_segment: rate_plan_id?.market_segment?.name,
				rate_code: rate_plan_id?.rate_code?.rate_code,
				room_type: room_type?.name,
				package_plan: package_plan?.name,
			};
    }

    organizedData[key][formattedDate] = {
      rate,
    };
  });

  return Object.values(organizedData);
};

export function convertToPageRoomAvailability<T>(
  baseResponse: any,
  isFormated: boolean = false
): CORE.Response<CORE.PageData<any>> {
  if (isFormated) {
    return {
      status: true,
   		message: '',
    	result: {
      	data: organizeDataByRoomAvailability(baseResponse.data) ?? [],
      	total: baseResponse.meta?.filter_count ?? 0,
        // pageSize: baseResponse.pagination?.pageSize ?? 0,
        // pageNumber: baseResponse.pagination?.pageNum ?? 1,
      },
    };
  }
  return {
    status: true,
		message: '',
		result: {
			data: baseResponse.data ?? [],
			total: baseResponse.meta?.filter_count ?? 0,
			// pageSize: baseResponse.pagination?.pageSize ?? 0,
			// pageNumber: baseResponse.pagination?.pageNum ?? 1,
		},
  };
}

const organizeDataByRoomAvailability = (data: any[]) => {
  const organizedData: any[] = [];

  data.forEach(item => {
    const roomData: Record<string, any> = {
      room_type_id: item.roomTypeId || null,
      room_type_code: item.roomTypeCode || '',
      room_type: item.roomTypeName || '',
      hotelId: item.hotelId || null,
    };

    item.availability.forEach(({ date, availability }: { date: string; availability: string }) => {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      roomData[formattedDate] = { availability: availability };
    });

    organizedData.push(roomData);
  });

  return organizedData;
};

export function mapViewRoomInfoList<T>(
  baseResponse: API.ResOp
): CORE.Response<CORE.PageData<any>> {
  return {
    status: baseResponse.isSuccess,
    message: baseResponse.errors ? baseResponse.errors[0].message : '',
    result: {
      data: formatBodyRoomList(baseResponse.data) ?? [],
      total: baseResponse.pagination?.total ?? 0,
      pageSize: baseResponse.pagination?.pageSize ?? 0,
      pageNumber: baseResponse.pagination?.pageNum ?? 1,
    },
  };
}
const formatBodyRoomList = (data: any) => {
  const groupedData: any = {};

  data.forEach((item: any) => {
    const groupKey = `${item.hotelId}_${item.roomTypeId}_${item.packageCode}_${item.allotmentNo}`;

    if (!groupedData[groupKey]) {
      groupedData[groupKey] = {
        hotelId: item.hotelId,
        packageName: item.packageName,
        sourceName: 'Allotment',
        rate: item.rate,
        roomTypeName: item.roomTypeName,
        availableRooms: item.availableRooms,
        roomTypeId: item.roomTypeId,
        roomTypeCode: item.roomTypeCode,
        ratePlanCode: item.ratePlanCode,
        packageCode: item.packageCode,
        allotmentNo: item.allotmentNo,
      };
    } else {
      // Cập nhật availableRooms với giá trị nhỏ nhất
      groupedData[groupKey].availableRooms = Math.min(
        groupedData[groupKey].availableRooms,
        item.availableRooms
      );
    }
  });

  // Trả về dữ liệu đã format dưới dạng mảng
  return Object.values(groupedData);
};
export function convertToResponseBooking<T>(
  baseResponse: any
): CORE.Response<CORE.PageData<any>> {
  return {
    status: baseResponse.isSuccess,
    message: baseResponse.errors ? baseResponse.errors[0].message : '',
    result: {
      data: baseResponse.data ?? [],
      total: baseResponse.pagination?.rowCount ?? 0,
      pageSize: baseResponse.pagination?.pageSize ?? 0,
      pageNumber: baseResponse.pagination?.pageCurrent ?? 1,
    },
  };
}

export function convertToPageDataMaster<T>(
  baseResponse: API.ResMaster
): CORE.Response<CORE.PageData<any>> {
  return {
    status: true,
    message: '',
    result: {
      data: baseResponse.data ?? [],
      total: baseResponse.meta?.filter_count ?? 0,
      // pageSize: baseResponse.pagination?.pageSize ?? 0,
      // pageNumber: baseResponse.pagination?.pageNum ?? 1,
    },
  };
}
