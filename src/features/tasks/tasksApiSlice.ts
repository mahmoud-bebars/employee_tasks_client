// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API } from "../../constants/env";
import { TaskApiResponse, ITask } from "../../common.types";

// Define a service using a base URL and expected endpoints
export const tasksApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: API }),
  reducerPath: "tasksApi",
  // Tag types are used for caching and invalidation.
  tagTypes: ["Tasks"],
  endpoints: (build) => ({
    getTasks: build.query<TaskApiResponse, string>({
      query: (id) => ({
        url: `tasks/employee/${id}`,
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),

    createTask: build.mutation<
      TaskApiResponse,
      { employee: string; body: ITask }
    >({
      query: ({ body, employee }) => ({
        url: `tasks`,
        method: "POST",
        body: { ...body, employeeId: employee },
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTask: build.mutation<TaskApiResponse, { id: string; body: ITask }>({
      query: ({ id, body }) => ({
        url: `tasks/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Tasks"],
    }),

    deleteTask: build.mutation<TaskApiResponse, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApiSlice;
