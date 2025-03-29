export const formatCurrency = (value: string) => {
  return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
};

export const formatMoney = (value: string | number): string => {
  if (!value) return "0";

  const numericValue =
    typeof value === "string"
      ? Number(value.replace(/\./g, "").replace(/,/g, ""))
      : Number(value);

  if (isNaN(numericValue)) return "0";

  return numericValue.toLocaleString("en-US").replace(/,/g, ".");
};
