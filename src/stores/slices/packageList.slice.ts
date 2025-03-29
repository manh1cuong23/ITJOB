import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ISource } from '@/utils/formatSelectSource';
import { apiPackageList } from '@/api/features/myAllotment';

interface PackageListState {
  packageList: ISource[];
}

const initialState: PackageListState = {
  packageList: [],
};

export const fetchPackageList = createAsyncThunk('PackageList/fetchPackageList', async () => {
  const response = await apiPackageList();
  return response.data.map((item: any) => ({
    label: item.name,
    value: item.code,
		packages: item.service,
  }));
});

const PackageListSlice = createSlice({
  name: 'PackageList',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchPackageList.fulfilled, (state, action) => {
      state.packageList = action.payload;
    });
  },
});

export const selectPackageList = (state: { packageList: PackageListState }) => state.packageList.packageList;
export default PackageListSlice.reducer;