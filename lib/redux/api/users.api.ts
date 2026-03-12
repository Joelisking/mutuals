import { api } from './index';
import { ApiResponse, AdminUser } from '@/lib/types/api';

interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR';
}

interface CreateUserResponse {
  user: AdminUser;
  tempPassword: string;
}

interface UpdateUserRoleRequest {
  id: string;
  role: 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR';
}

interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<ApiResponse<AdminUser[]>, void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),

    createUser: build.mutation<ApiResponse<CreateUserResponse>, CreateUserRequest>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),

    updateUserRole: build.mutation<ApiResponse<AdminUser>, UpdateUserRoleRequest>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['Users'],
    }),

    updateProfile: build.mutation<ApiResponse<AdminUser>, UpdateProfileRequest>({
      query: (body) => ({
        url: '/users/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Users'],
    }),

    changePassword: build.mutation<ApiResponse<{ message: string }>, ChangePasswordRequest>({
      query: (body) => ({
        url: '/users/me/password',
        method: 'PATCH',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserRoleMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = usersApi;
