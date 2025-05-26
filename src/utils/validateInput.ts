export function convertDataToIntervals(data: any) {
  const intervals = [];
  const temp: any = {};

  data.forEach((item: any) => {
    const match = item.key.match(/occupancy\[(\d+)\]\.(from|to)/);
    if (match) {
      const index = match[1];
      const type = match[2];
      if (!temp[index]) {
        temp[index] = {};
      }
      temp[index][type] = parseFloat(item.value);
    }
  });

  for (const key in temp) {
    if (temp[key].from !== undefined && temp[key].to !== undefined) {
      intervals.push(temp[key]);
    }
  }

  return intervals;
}

// Hàm kiểm tra sự chồng chéo
export function hasOverlap(data: any) {
  const intervals = convertDataToIntervals(data);
  // Sắp xếp các khoảng theo giá trị 'from' tăng dần
  intervals.sort((a, b) => a.from - b.from);

  // Duyệt qua các khoảng và kiểm tra sự chồng chéo
  for (let i = 0; i < intervals.length - 1; i++) {
    if (intervals[i].to > intervals[i + 1].from) {
      return true; // Có sự chồng chéo
    }
  }
  return false; // Không có sự chồng chéo
}
export const validateValueField = (
  setIsNotValid: (callback: (prevState: any) => any) => void,
  index: number,
  check: boolean | undefined
) => {
  return (_: any, value: any) => {
    if (check) {
      if (!value || value.trim() === '') {
        // Nếu không có giá trị (chưa nhập hoặc chỉ có khoảng trắng)
        setIsNotValid((prevState: any) => ({
          ...prevState, // Giữ lại các field hiện có
          [`value${index}`]: true,
        }));
        return Promise.reject();
      } else {
        setIsNotValid((prevState: any) => ({
          ...prevState, // Giữ lại các field hiện có
          [`value${index}`]: false,
        }));
      }
    }
    return Promise.resolve();
  };
};
export const validateBooleanField = (
  setIsNotValid: (callback: (prevState: any) => any) => void,
  index: number,
  check: boolean | undefined
) => {
  return (_: any, value: any) => {
    if (check) {
      if (typeof value !== 'boolean') {
        // Nếu giá trị không phải kiểu boolean
        setIsNotValid((prevState: any) => ({
          ...prevState, // Giữ lại các field hiện có
          [`increase${index}`]: true,
        }));
        return Promise.reject();
      } else {
        setIsNotValid((prevState: any) => ({
          ...prevState, // Giữ lại các field hiện có
          [`increase${index}`]: false,
        }));
      }
    }
    return Promise.resolve();
  };
};
