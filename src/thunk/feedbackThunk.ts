import { createAsyncThunk } from "@reduxjs/toolkit";

import { Feedback, getFeedbackList, sendFeedbackAPI } from "~/api/feedbackAPI";

export const sendFeedback = createAsyncThunk(
    'feedback/sendFeedback',
    async (feedback: Omit<Feedback, 'id' | 'user'> & { usersId: string }) => {
        await sendFeedbackAPI(feedback);
    }
);

export const getFeedbacks = createAsyncThunk(
    'feedback/getFeedbacks',
    async () => {
        return await getFeedbackList();
    }
);