import { ISource } from '@/utils/formatSelectSource';
import { InputData } from './type';

export function convertInput(input: any, selectOcccupancyDeletes: any) {
  const removeUndefinedFields = (obj: any) => {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        value === undefined ? undefined : value
      )
    );
  };
  const result = {
    hotel: input?.hotel,

    rate_settings: {
      create: input?.rates
        ?.filter((rate: any) => rate.id_rate_setting === undefined)
        .map((rate: any) => {
          const { id_rate_setting, id_item, id, ...rateWithoutId } = rate;
          return {
            rate_configuration_setting_item_id: {
              ...rateWithoutId,
            },
          };
        }),

      update: input?.rates
        ?.filter((rate: any) => rate.id_rate_setting !== undefined)
        .map((rate: any) => {
          const { id_rate_setting, id_item, ...rateWithoutId } = rate;
          return {
            rate_configuration_setting_item_id: {
              ...rateWithoutId,
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
              create: input?.occupancy
                ?.filter((occ: any) => occ?.id === undefined)
                ?.map((occ: any) =>
                  removeUndefinedFields({
                    adjustement_occupancy_id: {
                      ...occ,
                      priority: input?.priority_occupancy,
                      status: 'published',
                    },
                  })
                ),
              update: input?.occupancy
                ?.filter((occ: any) => occ?.id)
                .map((occ: any) => {
                  const { id_item, ...rest } = occ; // Loại bỏ id_item tạm thời
                  return {
                    adjustement_occupancy_id: {
                      ...rest,
                      priority: input?.priority_occupancy || undefined,
                    },
                    id: parseInt(id_item, 10),
                  };
                }),
              delete: selectOcccupancyDeletes || [],
            },
            item_daytype: {
              create: [],
              update: input?.dayType?.map((dayType: any) => {
                const { id_item, ...rest } = dayType; // Tách id_item khỏi các trường còn lại
                return {
                  adjustement_daytype_id: {
                    ...rest,
                    priority: input?.priority_day_type || undefined,
                  },
                  id: parseInt(id_item, 10), // Sử dụng id_item để gán giá trị cho id
                };
              }),
              delete: [],
            },
            item_season: {
              create: [],
              update: input?.season?.map((season: any) => {
                const { id_item, ...rest } = season; // Tách id_item khỏi các trường còn lại
                return {
                  adjustement_season_id: {
                    ...rest,
                    priority: input?.priority_season || undefined,
                  },
                  id: parseInt(id_item, 10), // Sử dụng id_item để gán giá trị cho id
                };
              }),
              delete: [],
            },
            rule: input?.occupancy2,
            is_occupancy: input?.is_occupancy,
            is_daytype: input?.is_daytype,
            is_season: input?.is_season,
            selected: input?.radioSelectAjustment || undefined,
            id: input?.id_rate_ajust_child,
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
            rule: input?.occupancy2,
            is_occupancy: input?.is_occupancy,
            is_daytype: input?.is_daytype,
            is_season: input?.is_season,
            selected: input?.radioSelectAjustment,
            item_occupancy: {
              create:
                input?.occupancy?.map((occ: any) => ({
                  adjustement_occupancy_id: {
                    from: parseFloat(occ?.from),
                    to: parseFloat(occ?.to),
                    value: isNaN(parseFloat(occ?.value))
                      ? null
                      : parseFloat(occ?.value),
                    status: 'published',
                    is_increase: occ?.is_increase,
                    is_percent: occ?.is_percent ?? false,
                    priority: input?.priority_occupancy,
                  },
                })) ?? [],
              update: [],
              delete: [],
            },
            item_daytype: {
              create:
                input?.dayType?.map((dayType: any) => ({
                  adjustement_daytype_id: {
                    type: dayType?.type,
                    value: isNaN(parseFloat(dayType?.value))
                      ? null
                      : parseFloat(dayType?.value),
                    status: 'published',
                    is_increase: dayType?.is_increase,
                    is_percent: dayType?.is_percent ?? false,
                    priority: input?.priority_day_type,
                  },
                })) ?? [],
              update: [],
              delete: [],
            },
            item_season: {
              create:
                input?.season?.map((season: any) => ({
                  adjustement_season_id: {
                    type: season?.type,
                    value: isNaN(parseFloat(season?.value))
                      ? null
                      : parseFloat(season?.value),
                    status: 'published',
                    is_increase: season?.is_increase,
                    is_percent: season?.is_percent ?? false,
                    priority: input?.priority_season,
                  },
                })) ?? [],
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
  is_increase: any;
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
      const match = key.match(/\d+/);
      if (match) {
        const index = match[0];

        if (!rates[parseInt(index)]) {
          rates[parseInt(index)] = {
            cost_rate: '',
            id: 0,
            rack_rate: '',
            distribution_rate: '',
            id_rate_setting: 0,
            id_item: 0, // Thêm trường id_item
          };
        }

        const field = key.split('.').slice(1).join('.');

        if (
          field === 'cost_rate' ||
          field === 'rack_rate' ||
          field === 'distribution_rate'
        ) {
          let value = data[key];
          if (typeof value === 'string' && value.includes('.')) {
            value = value.replace(/\./g, '');
          }
          rates[parseInt(index)][field] = value;
        } else {
          rates[parseInt(index)][field] = data[key];
        }
      }
    }
  }

  // Nhóm các trường 'occupancy' và thay thế dấu ',' bằng dấu '.'
  const occupancyMap: Record<string, Occupancy> = {}; // Map tạm để lưu các object đã nhóm
  const occupancy: Occupancy[] = [];

  for (const key in data) {
    if (key.startsWith('occupancy[')) {
      const match = key.match(/\d+/);
      if (match) {
        const index = match[0];

        if (!occupancyMap[index]) {
          occupancyMap[index] = {
            from: '',
            to: '',
            is_increase: false,
            value: '',
            id: 0,
            id_item: 0, // Thêm trường id_item
          };
        }

        const field = key.split('.').slice(1).join('.');

        if (field === 'from' || field === 'to' || field === 'value') {
          let value = data[key];
          if (typeof value === 'string') {
            value = value.replace(/\./g, '').replace(',', '.').trim();
            occupancyMap[index][field] = value === '' ? null : value;
          } else {
            occupancyMap[index][field] = value;
          }
        } else if (
          field === 'is_increase' &&
          Array.isArray(data[key]) &&
          data[key].length === 0
        ) {
          occupancyMap[index][field] = null;
        } else {
          occupancyMap[index][field] = data[key];
        }
      }
    }
  }

  // Chuyển từ object map sang mảng, loại bỏ phần tử undefined
  occupancy.push(...Object.values(occupancyMap));
  // Nhóm các trường 'dayType' và thay thế dấu ',' bằng dấu '.'
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
            id_item: 0, // Thêm trường id_item
          };
        }

        const field = key.split('.').slice(1).join('.');

        if (field === 'value') {
          let value = data[key];
          if (typeof value === 'string') {
            value = value.replace(/\./g, '').replace(',', '.').trim();
            dayType[parseInt(index)][field] = value === '' ? null : value;
          } else {
            dayType[parseInt(index)][field] = value;
          }
        } else {
          dayType[parseInt(index)][field] = data[key];
        }
      }
    }
  }

  // Nhóm các trường 'season' và thay thế dấu ',' bằng dấu '.'
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
            id_item: 0, // Thêm trường id_item
          };
        }

        const field = key.split('.').slice(1).join('.');

        if (field === 'value') {
          let value = data[key];
          if (typeof value === 'string') {
            value = value.replace(/\./g, '').replace(',', '.').trim();
            season[parseInt(index)][field] = value === '' ? null : value;
          } else {
            season[parseInt(index)][field] = value;
          }
        } else {
          season[parseInt(index)][field] = data[key];
        }
      }
    }
  }

  // Trả về dữ liệu đã nhóm lại
  return {
    hotel: data.hotel,
    rates,
    occupancy,
    occupancy2: data.occupancy,
    selected: data?.selected,
    is_occupancy: data.occupancyCheck,
    is_daytype: data.dayTypeCheck,
    is_season: data.seasonCheck,
    priority_occupancy: data.priority_occupancy,
    priority_day_type: data.priority_day_type,
    priority_season: data.priority_season,
    radioSelectAjustment: data?.radioSelectAjustment,
    dayType,
    season,
    createdAt: data.createdAt,
    modifiedAt: data.modifiedAt,
    status: data.status,
    id_rate_ajust: data.id_rate_ajust,
    id_rate_ajust_child: data.id_rate_ajust_child,
  };
}

export function transformDataIsource(data: InputData[]): ISource[] {
  return data.map(item => ({
    label: item.rate_code ? item.rate_code : item.name || 'Unnamed', // Gán tên ưu tiên theo code, name
    value: item.code || item.rate_code, // Giá trị value dựa trên trường code
    disabled: item.status !== 'published', // Disabled nếu status khác "published"
    id: item.id, // Lấy id nếu tồn tại
  }));
}

export const transformDataRateSetting = (data: any[]) => {
  let recordId = 0; // Đánh số tự động

  return data.reduce((result, rate) => {
    rate.RoomTypes?.forEach((room: any) => {
      if (room.PackagePlan.length > 0) {
        room.PackagePlan.forEach((pkg: any) => {
          result.push({
            id: recordId++, // Tự động tăng ID
            rate_code: {
              id: rate.Id,
              HotelId: rate.HotelId,
              rate_code: rate.RateCode,
            },
            cost_rate: '', // Giá trị mặc định là chuỗi rỗng
            rack_rate: '', // Giá trị mặc định là chuỗi rỗng
            distribution_rate: '', // Giá trị mặc định là chuỗi rỗng
            room_type: {
              id: room.Id,
              code: room.Code,
              name: room.Name,
            },
            package_plan: {
              id: pkg.Id,
              code: pkg.Code,
              name: pkg.Name,
            },
          });
        });
      }
    });

    return result;
  }, []);
};

export function compareMap(data1: any, data2: any): any {
  console.log('check data 1', data1);
  console.log('check data 2', data2);
  const newRowRateSetting: any = [];
  data1.forEach((item: any, index: number) => {
    const exitRow: boolean = data2.some(
      (item2: any) =>
        item2.package_plan.id == item.package_plan.id &&
        item2.room_type.id == item.room_type.id &&
        item2.rate_code.id == item.rate_code.id
    );
    if (!exitRow) {
      newRowRateSetting.push(item);
    }
  });
  console.log(newRowRateSetting);
  return newRowRateSetting;
}
