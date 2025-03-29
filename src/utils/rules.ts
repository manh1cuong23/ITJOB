export const strongPassword = {
  pattern:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  message:
    'Mật khẩu phải có ít nhất 8 ký tự, phải chứa ít nhất 1 ký tự in hoa, 1 ký tự in thường, 1 ký tự số và 1 ký tự đặc biệt',
};

export const requiredInput = (label: string) => {
  return { required: true, message: `${label} không được để trống` };
};
export const requiredSelect = (label: string) => {
  return { required: true, message: `${label} không được để trống` };
};

export const max255 = (label: string) => {
  return { max: 255, message: `${label} không quá 255 ký tự` };
};

export const taxCodeRule = {
  pattern: /^\d{10}-\d{3}$/,
  message: 'Định dạng mã số thuế không hợp lệ ',
};

export const phoneNumberRule = {
  pattern: /^(0(3|5|7|8|9)\d{8}|02\d{8})$/,
  message: 'Định dạng số điện thoại không hợp lệ ',
};

export const emailRule = {
  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  message: 'Định dạng email không hợp lệ ',
};

export const onlyNumberLetter = (label: string) => {
  return {
    pattern: /^[a-zA-Z0-9\sÀ-ỹ]*$/,
    message: `Định dạng ${label} không hợp lệ`,
  };
};

export const onlyLetter = (label: string) => {
  return {
    pattern: /^[a-zA-Z\sÀ-ỹ]*$/,
    message: `Định dạng ${label} không hợp lệ`,
  };
};
