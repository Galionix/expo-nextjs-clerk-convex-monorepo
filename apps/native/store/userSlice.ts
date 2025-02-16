import { createSlice } from "@reduxjs/toolkit";
import { Customer } from "@lemonsqueezy/lemonsqueezy.js";

interface UserState {
  lemonId: string | null;
  customer: Customer | null;
}

const initialState: UserState = {
  lemonId: null,
  customer: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLemonId: (state, action) => {
      state.lemonId = action.payload;
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
  },
});

export const { setLemonId, setCustomer } = userSlice.actions;
export default userSlice.reducer;
