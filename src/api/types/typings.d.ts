declare namespace API {
  type Pagination = {
    pageNum: number;
    pageSize: number;
    total: number;
  };
  type PaginationV1 = {
    pageCurrent: number;
    pageSize: number;
    rowCount: number;
  };
  type Error = {
    code: number;
    message: string;
  };

  type ResOp = {
    data: Record<string, any>[];
    result?: Record<string, any>[];
    pagination?: Pagination & PaginationV1;
    isSuccess: boolean;
    errors?: Error[];
  };
  type MyResponse<T = any> = Promise<Response<T>>;

  type TreeResult = {
    id: number;
    parentId: number;
    children: string[];
  };

  type UploadToken = {
    token: string;
  };
  type LoginDto = {
    username: string;
    password: string;
    captchaId: string;
    verifyCode: string;
  };
  // ====================================User ===============================================
  type UserDeleteParams = {
    id: string | number;
  };

  type UserDto = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userName: string;
    password?: string;
    birthDay?: string;
    address?: string;
    country?: string;
    city?: string;
    district?: string;
    referCode?: string;
  };
  export interface sortObj {
    field: string;
    order: string;
  }
  export interface SearchDto {
    pagination?: Pagination;
    searchFields?: searchObj[];
    sortFields?: sortObj;
  }

  export interface Pagination {
    page: number;
    pageSize: number;
  }
  export interface searchObj {
    key: string;
    value: string | number | string[] | boolean;
  }
  export interface SearchField {
    field: string;
    operator: string;
    value: string;
  }
  type FileUploadDto = {
    /** 文件 */
    file: Record<string, any>;
  };
  type UserEntity = {
    username: string;
    password: string;
    psalt: string;
    nickname: string;
    avatar: string;
    qq: string;
    email: string;
    phone: string;
    remark: string;
    status: number;
    roles: RoleEntity[];
    dept: DeptEntity;
    accessTokens: AccessTokenEntity[];
    id: number;
    createdAt: string;
    updatedAt: string;
  };

	type BookingVoucherDto = {
    token: string;
    appName: string;
    tranNo: string;
    tranCode: string;
    hotelId?: number;
  };

  type UserListParams = {
    page?: number;
    pageSize?: number;
    field?: string;
    order?: 'ASC' | 'DESC';
    /** 头像 */
    avatar?: string;
    /** 登录账号 */
    username?: string;
    /** 登录密码 */
    password?: string;
    /** 归属角色 */
    roleIds?: number[];
    /** 归属大区 */
    deptId?: number;
    /** 呢称 */
    nickname?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号 */
    phone?: string;
    /** QQ */
    qq?: string;
    /** 备注 */
    remark?: string;
    /** 状态 */
    status?: 0 | 1;
    _t?: number;
  };

  type UserPasswordDto = {
    /** 更改后的密码 */
    password: string;
  };

  type UserPasswordParams = {
    id: number;
  };

  type UserReadParams = {
    id: number;
  };
  type ByIdParams = {
    id: number | string;
  };
  type UserUpdateDto = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userName: string;
    password: string;
    birthDay: string;
    address: string;
    country: string;
    city: string;
    district: string;
    referCode: string;
  };
  type UserSearchParams = {};
  type UserUpdateParams = {
    id: number | string;
  };
  type RoleDeleteParams = {
    id: number | string;
  };
  // =================== My Allotment ===========
  type MyAllotmentData = {
    id: string;
    hotelId: string;
    hotelName: string;
    date: string;
    roomTypeId: string;
    roomTypeCode: string;
    roomTypeName: string;
    buildingCode: string;
    buildingName: string;
    allotmentNo: string;
    travelAgentCode: string;
    packageCode: string;
    travelAgentName: string;
    availableRooms: number;
    totalRooms: number;
    rate: number;
    currency: string;
    ratePlanCode: string;
  };
  type HotelListData = {
    id: string;
    hotelId: string;
    code: string;
    shortName: string;
    fullName: string;
    description: string;
    contactPhone: string;
    address: string;
    website: string;
    country: string;
    province: string;
    district: string;
    location: string;
    places: Place[];
    starRating: number;
    reviewRate: any;
    images: Image[];
    hotelType: string;
    checkInTime: string;
    checkOutTime: string;
    amenities: Amenity[];
  };
  type Place = {
    id: string;
    code: string;
    name: string;
    provinceCode: string;
  };

  type Image = {
    imageId: string;
    imageTitle: string;
    imageUrl: string;
    order: number;
  };

  type Amenity = {
    id: string;
    code: string;
    name: string;
    icon: string;
  };
  type BookingCreateDto = {
    bookingItems: BookingItem[];
    bookingGuestInfos: BookingGuestInfo[];
    bookingExtraServices: BookingExtraService[];
    bookingRefId: string;
    bookingDate: string;
    bookingTime: string;
    bookingSourceCode: string;
    hotelId: number;
    cmHotelId: string;
    arrivalDate: string;
    departureDate: string;
    totalAdults: number;
    totalChildren: number;
    bookingStatus: number;
    paymentStatus: number;
    addtionalNotes: string;
    discount: number;
    discountRate: number;
    totalTax: number;
    totalFee: number;
    totalFeeServiceCharge: number;
    subAmount: number;
    totalAmount: number;
    paidAmount: number;
    taCode: string;
    subSegment: string;
    bookingType: number;
  };

  type BookingUpdateDto = {
    id: number;
    bookingItems: BookingItem[];
    bookingGuestInfos: BookingGuestInfo[];
    bookingExtraServices: BookingExtraService[];
    bookingRefId: string;
    bookingDate: string;
    bookingTime: string;
    bookingSourceCode: string;
    hotelId: number;
    cmHotelId: string;
    arrivalDate: string;
    departureDate: string;
    totalAdults: number;
    totalChildren: number;
    bookingStatus: number;
    paymentStatus: number;
    addtionalNotes: string;
    discount: number;
    discountRate: number;
    totalTax: number;
    totalFee: number;
    totalFeeServiceCharge: number;
    subAmount: number;
    totalAmount: number;
    paidAmount: number;
    taCode: string;
    subSegment: string;
    bookingType: number;
  };

  type BookingItem = {
    bookingDate: string;
    roomTypeId: number;
    roomTypeCode: string;
    adults: number;
    children: number;
    rate: number;
    ratePlanCode: string;
    discount: number;
    tax: number;
    fee: number;
    amount: number;
    status: number;
    source: string;
    packageCode: string;
    allotmentNo: string;
    bookingNightRates: BookingNightRate[];
  };

  type BookingNightRate = {
    date: string;
    rate: number;
    adults: number;
    children: number;
    packageCode: string;
    ratePlanCode: string;
    remark: string;
    bookingItemId: number;
  };

  type BookingGuestInfo = {
    bookingId: number;
    bookingNo: string;
    guestId: number;
    guestType: number;
    arrivalDate: string;
    departureDate: string;
    remark: string;
  };

  type BookingExtraService = {
    serviceId: number;
    serviceCode: string;
    quantity: number;
    price: number;
    amount: number;
    discount: number;
    discountAmount: number;
    totalAmount: number;
    fromDate: string;
    toDate: string;
  };

  type BookingRejectDto = {
    bookingIds?: number[];
		bookingItemIds?: number[]
    status: number;
    note: string;
  };

  type BookingItemCancelDto = {
    bookingItemId: number[];
    note: string;
  };
  type BookingItemListCancelDto = {
    bookingItemIds: number[];
    note: string;
  };

  type ResMaster = {
    data: Record<string, any>[];
    meta?: {
      total_count: number;
      filter_count: number;
    };
  };
}
