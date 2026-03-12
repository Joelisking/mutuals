'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BASE_URL } from '@/lib/constants';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? 'Invalid or expired reset link.');
        return;
      }
      setDone(true);
      setTimeout(() => router.push('/admin/login'), 3000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 text-center">
        <p className="text-sm text-zinc-400">Invalid reset link. Please request a new one.</p>
        <Link href="/admin/forgot-password" className="mt-4 inline-block text-sm text-[#1ecbe1] hover:underline">
          Request reset link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-10 w-10 text-[#1ecbe1]" />
        </div>
        <p className="text-sm text-zinc-300">Password reset successfully. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-zinc-300">New password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 8 characters"
          required
          className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm" className="text-zinc-300">Confirm password</Label>
        <Input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat your new password"
          required
          className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" disabled={isLoading} className="w-full text-black">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Reset password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <p className="text-sm font-bold tracking-widest uppercase text-[#1ecbe1] mb-6">Mutuals+</p>
          <h1 className="text-2xl font-semibold text-white">Set new password</h1>
          <p className="mt-2 text-sm text-zinc-400">Choose a strong password for your account.</p>
        </div>

        <Suspense fallback={<div className="h-40 flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-zinc-500" /></div>}>
          <ResetPasswordForm />
        </Suspense>

        <div className="text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
