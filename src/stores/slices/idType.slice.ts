import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTypeID } from '@/api/features/typeID';
import { ISource } from '@/utils/formatSelectSource';

interface IdTypeState {
  idType: ISource[];
}

const initialState: IdTypeState = {
  idType: [],
};

export const fetchTypeID = createAsyncThunk('idType/fetchTypeID', async () => {
  const response = await getTypeID();
  return response.data.map((item: any) => ({
    value: item.code,
    label: item.name,
  }));
});

const idTypeSlice = createSlice({
  name: 'idType',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchTypeID.fulfilled, (state, action) => {
      state.idType = action.payload;
    });
  },
});

export const selectIdType = (state: { idType: IdTypeState }) => state.idType.idType;
export default idTypeSlice.reducer;