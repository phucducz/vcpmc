import { createSlice } from "@reduxjs/toolkit";
import { Feedback } from "~/api/feedbackAPI";
import { getFeedbacks, sendFeedback } from "~/thunk/feedbackThunk";

interface InitialState {
    feedbacks: Array<Feedback>;
    loading: boolean;
}

const initialState: InitialState = {
    feedbacks: [],
    loading: false,
}

export const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getFeedbacks.pending, state => {
            state.loading = true;
        })
        builder.addCase(getFeedbacks.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload) state.feedbacks = action.payload;
        })
        builder.addCase(getFeedbacks.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        })
        builder.addCase(sendFeedback.pending, state => {
            state.loading = true;
        })
        builder.addCase(sendFeedback.fulfilled, state => {
            state.loading = false;
        })
        builder.addCase(sendFeedback.rejected, (state, action) => {
            state.loading = false;
            throw new Error(`${action.error.name}: ${action.error.message}`);
        })
    }
});

export const { reducer: feedBackReducer } = feedbackSlice;