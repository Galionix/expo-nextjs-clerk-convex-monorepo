import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  lemonId: string | null;
}

const initialState: UserState = {
  lemonId: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLemonId: (state, action) => {
      state.lemonId = action.payload;
    },
  },
});

export const { setLemonId } = userSlice.actions;
export default userSlice.reducer;
