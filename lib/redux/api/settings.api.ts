import { api } from './index';
import { ApiResponse, SiteSetting } from '@/lib/types/api';

// Settings API endpoints
export const settingsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Get all settings
    getSettings: build.query<ApiResponse<SiteSetting[]>, void>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),

    // Initialize default settings
    initializeSettings: build.mutation<ApiResponse<SiteSetting[]>, void>({
      query: () => ({
        url: '/settings/initialize',
        method: 'POST',
      }),
      invalidatesTags: ['Settings'],
    }),

    // Get setting by key
    getSettingByKey: build.query<ApiResponse<SiteSetting>, { key: string }>({
      query: ({ key }) => `/settings/${key}`,
      providesTags: ['Settings'],
    }),

    // Update setting
    updateSetting: build.mutation<
      ApiResponse<SiteSetting>,
      { key: string; value: string | string[] | object; type?: string; description?: string }
    >({
      query: ({ key, ...body }) => ({
        url: `/settings/${key}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    // Delete setting
    deleteSetting: build.mutation<ApiResponse<{ message: string }>, { key: string }>({
      query: ({ key }) => ({
        url: `/settings/${key}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Settings'],
    }),

    // Get article categories
    getArticleCategories: build.query<ApiResponse<string[]>, void>({
      query: () => '/settings/categories/articles',
      providesTags: ['Settings'],
    }),

    // Update article categories
    updateArticleCategories: build.mutation<ApiResponse<SiteSetting>, { categories: string[] }>({
      query: (body) => ({
        url: '/settings/categories/articles',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    // Get contact categories
    getContactCategories: build.query<ApiResponse<string[]>, void>({
      query: () => '/settings/categories/contact',
      providesTags: ['Settings'],
    }),

    // Update contact categories
    updateContactCategories: build.mutation<ApiResponse<SiteSetting>, { categories: string[] }>({
      query: (body) => ({
        url: '/settings/categories/contact',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    // Get event types
    getEventTypes: build.query<ApiResponse<string[]>, void>({
      query: () => '/settings/categories/events',
      providesTags: ['Settings'],
    }),

    // Update event types
    updateEventTypes: build.mutation<ApiResponse<SiteSetting>, { types: string[] }>({
      query: (body) => ({
        url: '/settings/categories/events',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    // Get shop product categories
    getShopProductCategories: build.query<ApiResponse<string[]>, void>({
      query: () => '/settings/categories/shop-products',
      providesTags: ['Settings'],
    }),

    // Update shop product categories
    updateShopProductCategories: build.mutation<ApiResponse<SiteSetting>, { categories: string[] }>({
      query: (body) => ({
        url: '/settings/categories/shop-products',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    // Get artist submission roles
    getArtistSubmissionRoles: build.query<ApiResponse<string[]>, void>({
      query: () => '/settings/categories/artist-roles',
      providesTags: ['Settings'],
    }),

    // Update artist submission roles
    updateArtistSubmissionRoles: build.mutation<ApiResponse<SiteSetting>, { roles: string[] }>({
      query: (body) => ({
        url: '/settings/categories/artist-roles',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSettingsQuery,
  useInitializeSettingsMutation,
  useGetSettingByKeyQuery,
  useUpdateSettingMutation,
  useDeleteSettingMutation,
  useGetArticleCategoriesQuery,
  useUpdateArticleCategoriesMutation,
  useGetContactCategoriesQuery,
  useUpdateContactCategoriesMutation,
  useGetEventTypesQuery,
  useUpdateEventTypesMutation,
  useGetShopProductCategoriesQuery,
  useUpdateShopProductCategoriesMutation,
  useGetArtistSubmissionRolesQuery,
  useUpdateArtistSubmissionRolesMutation,
} = settingsApi;
