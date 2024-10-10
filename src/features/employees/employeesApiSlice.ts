// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API } from "../../constants/env";
import { EmployeeApiResponse, IEmployee } from "../../common.types";

// Define a service using a base URL and expected endpoints
export const employeesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: API }),
  reducerPath: "employeesApi",
  // Tag types are used for caching and invalidation.
  tagTypes: ["Employees"],
  endpoints: (build) => ({
    getEmployees: build.query<EmployeeApiResponse, void>({
      query: () => ({
        url: `employees`,
        method: "GET",
      }),
      providesTags: ["Employees"],
    }),

    createEmployee: build.mutation<EmployeeApiResponse, IEmployee>({
      query: (body) => ({
        url: `employees`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Employees"],
    }),

    updateEmployee: build.mutation<
      EmployeeApiResponse,
      { id: string; body: IEmployee }
    >({
      query: ({ id, body }) => ({
        url: `employees/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Employees"],
    }),

    deleteEmployee: build.mutation<EmployeeApiResponse, string>({
      query: (id) => ({
        url: `employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeesApiSlice;
