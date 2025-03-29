import {
  InputSearchBooking,
  InputSearchService,
} from '@/components/business/input';
import {
  MultiSelectBasic,
  SelectHotelSearch,
  SelectHotelsSearch,
} from '@/components/business/select';
import { ISource } from '@/utils/formatSelectSource';
interface QuickSearchFormProps {
  // onHotelIdChange?: (value: any) => void;
  hotelList: ISource[];
  // onChangeFromTo: (date: [string, string] | null) => void;
  // roomTypeOptions: ISource[];
  // onRoomTypeChange: (value: any) => void;
}
const QuickSearchForm = (props: QuickSearchFormProps) => {
  const { hotelList } = props;
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      {/* <SelectHotelSearch
        name="hotelId"
        // onChange={onHotelIdChange}
        options={hotelList}
        // defaultValue={hotelList[0]?.value}
      /> */}
      <SelectHotelsSearch
        name="hotelId"
        maxTagCount={1}
        options={hotelList}
        // defaultValue={hotelList[0]?.value}
      />
      <InputSearchService />
    </div>
  );
};

export { QuickSearchForm };
