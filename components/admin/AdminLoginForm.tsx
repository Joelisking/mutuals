"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { usePostAuthLoginMutation } from "@/lib/redux/api/openapi.generated";
import { useDispatch } from "@/lib/redux/store";
import { authActions } from "@/lib/redux/slices/auth";
import { MUTUALS_COOKIE_ID } from "@/lib/constants";
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

const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

      const data = (result as any)?.data;

      if (!data?.user || !data?.accessToken) {
        toast.error("Login failed: unexpected response from server");
        return;
      }

      const { user, accessToken, refreshToken } = data;

      // Persist token in a cookie so the Next.js middleware can read it
      document.cookie = [
        `${MUTUALS_COOKIE_ID}=${accessToken}`,
        `path=/`,
        `max-age=${SEVEN_DAYS_IN_SECONDS}`,
        `SameSite=Strict`,
      ].join('; ');

      dispatch(authActions.loginSuccess({ user, accessToken, refreshToken }));
      toast.success("Login successful");

      // Redirect to the originally requested page, or dashboard
      const from = searchParams.get("from") || "/admin/dashboard";
      router.push(from);
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
