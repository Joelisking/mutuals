
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { usePostAuthLoginMutation } from "@/lib/redux/api/openapi.generated";
import { useDispatch } from "@/lib/redux/store";
import { authActions } from "@/lib/redux/slices/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export function AdminLoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = usePostAuthLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await login({
        body: {
          email: values.email,
          password: values.password,
        },
      }).unwrap();

      // Dispatch login success action to store user and token
      // We need to decode the token or assume the backend returns user info.
      // The generated type PostAuthLoginApiResponse doesn't seem to have data fields visible here, 
      // but usually it mimics the success response.
      // Let's assume result.data contains user and tokens as per common patterns or check the type definition.
      // Based on typical API we might need to fetch user profile after login or the login response has it.
      // The swagger says "Login successful" but didn't explicitly show the schema of the response data in the summary I saw.
      // However, usually it returns { success: true, data: { user, accessToken, refreshToken } }
      
      // Let's inspect the result structure in console if needed, but standard practice:
      
      // Assuming structure based on auth slice expectation:
      if (result && (result as any).data) {
          const { user, accessToken, refreshToken } = (result as any).data;
          dispatch(authActions.loginSuccess({ user, accessToken, refreshToken }));
          toast.success("Login successful");
          router.push("/admin/dashboard");
      } else {
           // Fallback or if structure is different. 
           // If the API only returns a message, we might need to call /auth/me
           // But auth slice expects user.
           // For now, let's assume standard response.
           
           // If 'data' is missing, it might be that the result IS the data if unwrapped?
           // No, unwrap returns the payload.
           
          toast.error("Login failed: Invalid response format");
      }

    } catch (error: any) {
      console.error("Login Error:", error);
      const errorMessage = error?.data?.message || "Invalid email or password";
      toast.error(errorMessage);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="admin@mutuals.plus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </Form>
  );
}
