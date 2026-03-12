import { api } from './index';
import { ApiResponse, Order, OrderStatus, Discount, ValidateDiscountResponse } from '@/lib/types/api';

// Orders API
export const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<ApiResponse<Order[]>, { page?: number; limit?: number; status?: string; email?: string }>({
      query: (params) => ({ url: '/orders', params }),
      providesTags: ['Order'],
    }),
    getOrderById: build.query<ApiResponse<Order>, string>({
      query: (id) => `/orders/${id}`,
      providesTags: ['Order'],
    }),
    updateOrderStatus: build.mutation<ApiResponse<Order>, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
    // Discounts
    getDiscounts: build.query<ApiResponse<Discount[]>, void>({
      query: () => '/discounts',
      providesTags: ['Discount'],
    }),
    createDiscount: build.mutation<ApiResponse<Discount>, Partial<Discount>>({
      query: (body) => ({ url: '/discounts', method: 'POST', body }),
      invalidatesTags: ['Discount'],
    }),
    updateDiscount: build.mutation<ApiResponse<Discount>, { id: string } & Partial<Discount>>({
      query: ({ id, ...body }) => ({ url: `/discounts/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Discount'],
    }),
    deleteDiscount: build.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/discounts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Discount'],
    }),
    validateDiscount: build.mutation<ApiResponse<ValidateDiscountResponse>, { code: string; orderTotal: number }>({
      query: (body) => ({ url: '/discounts/validate', method: 'POST', body }),
    }),
    getSitewideDiscount: build.query<ApiResponse<Discount | null>, void>({
      query: () => '/discounts/sitewide',
      providesTags: ['Discount'],
    }),
    setSitewideDiscount: build.mutation<ApiResponse<Discount>, string>({
      query: (id) => ({ url: `/discounts/sitewide/${id}`, method: 'PUT' }),
      invalidatesTags: ['Discount'],
    }),
    clearSitewideDiscount: build.mutation<ApiResponse<null>, void>({
      query: () => ({ url: '/discounts/sitewide', method: 'DELETE' }),
      invalidatesTags: ['Discount'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetDiscountsQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
  useValidateDiscountMutation,
  useGetSitewideDiscountQuery,
  useSetSitewideDiscountMutation,
  useClearSitewideDiscountMutation,
} = ordersApi;
