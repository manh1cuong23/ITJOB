export const validateValue = (input: string) => {
  const regex = /^\d+$/; // Định dạng số nguyên không âm
  if (!regex.test(input)) return false;

  return true; // Chỉ cần kiểm tra regex vì mọi số trong regex này đều không âm
};
export const handleBeforeInputRateDolla = (
  e: React.FormEvent<HTMLInputElement>
) => {
  const inputValue = (e.nativeEvent as InputEvent).data;
  if (!inputValue) return; // Bỏ qua các sự kiện không nhập trực tiếp (backspace, delete)
  const currentValue = e.currentTarget.value;
  const nextValue = currentValue + inputValue;
  if (!validateValue(nextValue)) {
    e.preventDefault(); // Chặn sự kiện nhập nếu giá trị không hợp lệ
  }
};
export const removeDot = (value: string | undefined): string => {
  return value ? value.replace(/\./g, '') : '';
};
export const removeDotsFromSelectedFields = (
  obj: Record<string, any>,
  fieldsToRemoveDot: string[]
): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      fieldsToRemoveDot.includes(key) && typeof value === 'string'
        ? removeDot(value)
        : value,
    ])
  );
};
export const convertCommaToDot = (value: string | undefined): string => {
  return value ? value.replace(/,/g, '.') : '';
};
export const convertDotToComma = (value: string | undefined): string => {
  if (!value) return '';
  console.log('check value', value);
  // Chuyển chuỗi thành số
  const num = parseFloat(value);
  // let formatted;
  // if (isNaN(num)) {
  //   formatted = num.toString();
  // } else {
  //   console.log('num check', num, typeof num, Number.isInteger(num));
  //   formatted = Number.isInteger(num) ? num.toFixed(0) : num.toString();
  // }
  // Nếu là số nguyên (thập phân là .00) thì loại bỏ phần thập phân

  // Chuyển dấu . thành ,
  return num.toString().replace(/\./g, ',');
};
export const formatNumberValueToDolla = (value: string): string => {
  if (!isNaN(Number(value))) {
    return Number(value).toLocaleString('en-US').replace(/,/g, '.'); // Định dạng số và thay dấu ',' bằng '.'
  } else {
    return value; // Trả về giá trị gốc nếu không hợp lệ
  }
};
// const validateValueFloat = (input: string) => {
//   const regex = /^(\d{1,2})(,(\d{1,2})?)?$/; // Định dạng 99,99
//   if (!regex.test(input)) return false;

//   const [integerPart, decimalPart] = input.split(',').map(Number);
//   if (integerPart < 0 || integerPart > 99) return false;

//   if (decimalPart < 0 || decimalPart > 99) return false;

//   return true;
// };
// export const handleBeforeInputFloat = (
//   e: React.FormEvent<HTMLInputElement>
// ) => {
//   const inputValue = (e.nativeEvent as InputEvent).data;
//   if (!inputValue) return; // Bỏ qua các sự kiện không nhập trực tiếp (backspace, delete)
//   const currentValue = e.currentTarget.value;
//   const nextValue = currentValue + inputValue;
//   if (!validateValueFloat(nextValue)) {
//     e.preventDefault(); // Chặn sự kiện nhập nếu giá trị không hợp lệ
//   }
// };

const validateValueFloat = (input: string) => {
  const regex = /^\d{1,2}(,\d{0,2})?$/; // Định dạng 99,99
  return regex.test(input);
};

export const handleBeforeInputFloat = (
  e: React.FormEvent<HTMLInputElement>
) => {
  const inputValue = (e.nativeEvent as InputEvent).data;
  if (!inputValue) return; // Bỏ qua các sự kiện không nhập trực tiếp (backspace, delete)

  const currentValue = e.currentTarget.value;

  // Khi nhập dấu `.`, thay thế thành `,`
  if (inputValue === '.') {
    if (currentValue.includes(',')) {
      e.preventDefault(); // Ngăn nhập thêm nếu đã có dấu `,`
      return;
    }
    e.currentTarget.value = currentValue + ',';
    e.preventDefault();
    return;
  }

  // Chỉ cho phép nhập số và dấu `,`
  if (!/^\d$/.test(inputValue)) {
    e.preventDefault();
    return;
  }

  const nextValue = currentValue + inputValue;

  // Kiểm tra xem giá trị có hợp lệ không
  if (!validateValueFloat(nextValue)) {
    e.preventDefault();
  }
};
export const formatNumberFields = (obj: any, fieldsToFormat: string[]): any => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      fieldsToFormat.includes(key) && typeof value === 'string'
        ? Number(value).toLocaleString('en-US').replace(/,/g, '.') // Định dạng số
        : value,
    ])
  );
};
