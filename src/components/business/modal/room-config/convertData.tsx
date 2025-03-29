export function convertInput(input: any) {
  const result = {
    hotel: input?.hotel,
    rate_settings: {
      create: [],
      update: input?.rates?.map((rate: any) => {
        const { id_rate_setting, ...rateWithoutId } = rate; // Tách trường id_rate_setting ra khỏi rate
        return {
          rate_configuration_setting_item_id: {
            ...rateWithoutId, // Sử dụng rateWithoutId để sao chép tất cả các trường còn lại
          },
          id: parseInt(rate?.id_rate_setting, 10),
        };
      }),
      delete: [],
    },
    rate_adjustement: {
      create: [],
      update: [
        {
          rate_configuration_adjustement_id: {
            item_occupancy: {
              create: [],
              update: input?.occupancy?.map((occ: any) => ({
                adjustement_occupancy_id: {
                  ...occ,
                },
                id: parseInt(occ?.id, 10),
              })),
              delete: [],
            },
            item_daytype: {
              create: [],
              update: input?.dayType?.map((dayType: any) => ({
                adjustement_daytype_id: {
                  ...dayType,
                },
                id: parseInt(dayType?.id, 10),
              })),
              delete: [],
            },
            item_season: {
              create: [],
              update: input?.season?.map((season: any) => ({
                adjustement_season_id: {
                  ...season,
                },
                id: parseInt(season?.id, 10),
              })),
              delete: [],
            },
            occupancy: input?.occupancy2,
            id: input?.id_rate_ajust,
          },
          id: input?.id_rate_ajust,
        },
      ],
      delete: [],
    },
  };

  return result;
}

export function convertInputPost(input: any) {
  const result = {
    hotel: input?.hotel,
    rate_settings: {
      create: input?.rates?.map((rate: any) => ({
        rate_configuration_setting_item_id: {
          rate_code: rate?.rate_code,
          room_type: rate?.room_type,
          package_plan: rate?.package_plan,
          cost_rate: parseFloat(rate?.cost_rate),
          rack_rate: parseFloat(rate?.rack_rate),
          distribution_rate: parseFloat(rate?.distribution_rate),
          status: 'published',
        },
      })),
      update: [],
      delete: [],
    },
    rate_adjustement: {
      create: [
        {
          rate_configuration_adjustement_id: {
            occupancy: input?.occupancy2,
            item_occupancy: {
              create: input?.occupancy?.map((occ: any) => ({
                adjustement_occupancy_id: {
                  from: parseFloat(occ?.from),
                  to: parseFloat(occ?.to),
                  value: parseFloat(occ?.value),
                  status: 'published',
                  is_increase: occ?.is_increase,
                  is_percent: occ?.is_percent,
                  priority: input?.priority_occupancy,
                },
              })),
              update: [],
              delete: [],
            },
            item_daytype: {
              create: input?.dayType?.map((dayType: any) => ({
                adjustement_daytype_id: {
                  type: dayType?.type,
                  value: parseFloat(dayType?.value),
                  status: 'published',
                  is_increase: dayType?.is_increase,
                  is_percent: dayType?.is_percent,
                  priority: input?.priority_day_type,
                },
              })),
              update: [],
              delete: [],
            },
            item_season: {
              create: input?.season?.map((season: any) => ({
                adjustement_season_id: {
                  type: season?.type,
                  value: parseFloat(season?.value),
                  status: 'published',
                  is_increase: season?.is_increase,
                  is_percent: season?.is_percent,
                  priority: input?.priority_season,
                },
              })),
              update: [],
              delete: [],
            },
            status: 'published',
          },
        },
      ],
      update: [],
      delete: [],
    },
    status: 'published',
  };

  return result;
}

interface Rate {
  cost_rate: string;
  id: number;
  rack_rate: string;
  distribution_rate: string;
  id_rate_setting: number;
  [key: string]: string | number; // Thêm index signature cho phép các trường động
}

interface Occupancy {
  from: string;
  to: string;
  is_increase: boolean;
  value: string;
  id: number;
  [key: string]: string | boolean | number; // Thêm index signature cho phép các trường động
}

interface DayType {
  is_increase: boolean;
  value: string;
  id: number;
  [key: string]: boolean | string | number; // Thêm index signature cho phép các trường động
}

interface Season {
  is_increase: boolean;
  value: string;
  id: number;
  [key: string]: boolean | string | number; // Thêm index signature cho phép các trường động
}

export function groupData(data: any) {
  // Nhóm các trường 'rates' dựa trên chỉ số trong tên trường
  const rates: Rate[] = [];
  for (const key in data) {
    if (key.startsWith('rates[')) {
      // Lấy chỉ số từ key, ví dụ "rates[0].cost_rate" => 0
      const match = key.match(/\d+/);
      if (match) {
        const index = match[0];

        // Nếu chưa khởi tạo mảng cho chỉ số đó, tạo mới
        if (!rates[parseInt(index)]) {
          rates[parseInt(index)] = {
            cost_rate: '',
            id: 0,
            rack_rate: '',
            distribution_rate: '',
            id_rate_setting: 0,
          };
        }

        // Tách tên trường và gán giá trị vào đúng chỉ số
        const field = key.split('.').slice(1).join('.'); // "cost_rate", "id", etc.
        rates[parseInt(index)][field] = data[key]; // Không còn lỗi khi sử dụng field
      }
    }
  }

  // Nhóm các trường 'occupancy'
  const occupancy: Occupancy[] = [];
  for (const key in data) {
    if (key.startsWith('occupancy[')) {
      const match = key.match(/\d+/);
      if (match) {
        const index = match[0];
        if (!occupancy[parseInt(index)]) {
          occupancy[parseInt(index)] = {
            from: '',
            to: '',
            is_increase: false,
            value: '',
            id: 0,
          };
        }
        const field = key.split('.').slice(1).join('.');
        occupancy[parseInt(index)][field] = data[key];
      }
    }
  }

  // Nhóm các trường 'dayType'
  const dayType: DayType[] = [];
  for (const key in data) {
    if (key.startsWith('dayType[')) {
      const match = key.match(/\d+/);
      if (match) {
        const index = match[0];
        if (!dayType[parseInt(index)]) {
          dayType[parseInt(index)] = {
            is_increase: false,
            value: '',
            id: 0,
          };
        }
        const field = key.split('.').slice(1).join('.');
        dayType[parseInt(index)][field] = data[key];
      }
    }
  }

  // Nhóm các trường 'season'
  const season: Season[] = [];
  for (const key in data) {
    if (key.startsWith('season[')) {
      const match = key.match(/\d+/);
      if (match) {
        const index = match[0];
        if (!season[parseInt(index)]) {
          season[parseInt(index)] = {
            is_increase: false,
            value: '',
            id: 0,
          };
        }
        const field = key.split('.').slice(1).join('.');
        season[parseInt(index)][field] = data[key];
      }
    }
  }

  // Trả về dữ liệu đã nhóm lại
  return {
    hotel: data.hotel,
    rates,
    occupancy,
    occupancy2: data.occupancy,
    priority_occupancy: data.priority_occupancy,
    priority_day_type: data.priority_day_type,
    priority_season: data.priority_season,
    dayType,
    season,
    createdAt: data.createdAt,
    modifiedAt: data.modifiedAt,
    status: data.status,
    id_rate_ajust: data.id_rate_ajust,
  };
}
