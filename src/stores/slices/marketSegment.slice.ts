import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ISource } from '@/utils/formatSelectSource';
import { getMarketSegmentList } from '@/api/features/marketSegment';

interface marketSegmentListState {
  marketSegmentList: ISource[];
}

const initialState: marketSegmentListState = {
  marketSegmentList: [],
};

export const fetchMarketSegmentList = createAsyncThunk('marketSegmentList/fetchMarketSegmentList', async () => {
  const response = await getMarketSegmentList();
  return response.data.map((item: any) => ({
    label: item.name,
    value: item.id,
		code: item.code
  }));
});

const marketSegmentListSlice = createSlice({
  name: 'marketSegmentList',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMarketSegmentList.fulfilled, (state, action) => {
      state.marketSegmentList = action.payload;
    });
  },
});

export const selectMarketSegmentList = (state: { marketSegmentList: marketSegmentListState }) => state.marketSegmentList.marketSegmentList;
export default marketSegmentListSlice.reducer;