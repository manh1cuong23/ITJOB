import { Option } from '@/components/basic/select/SingleSelectSearchCustom';

export function getLabelsFromOptions(
  options: any[],
  selectedValues: any[]
): string[] {
  if (!Array.isArray(selectedValues)) return [];

  return options
    .filter(item => selectedValues.includes(item.value))
    .map(item => item.label);
}

export function getLableSingle(level: number, levels: Option[]): string {
  const found = levels.find(item => item.value === level);
  return found ? found.label : 'Không xác định';
}

export function mapFieldsToOptions(fields: any[]) {
  return fields.map(item => item?.name);
}

export function getCountByStatus(data: any, statusValue: any) {
  const item = data.find((item: any) => item.status === statusValue);
  return item ? item.count : 0;
}
