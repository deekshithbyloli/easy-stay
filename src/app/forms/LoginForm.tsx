'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  login: z.string().min(2, {
    message: 'Please enter username or email',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
});

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'An unexpected error occurred',
        }));
        throw new Error(errorData.error || 'Failed to login');
      }

      const data = await response.json();

      sessionStorage.setItem('userId', data.userId);
      sessionStorage.setItem('hostId', data.hostId);
      sessionStorage.setItem('role', data.role);

      if (data.role === 'host') {
        router.push('/host');
      } else if (data.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600">
      {/* Left Side */}
      <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden">
        <Image
          src="/login.jpeg" // Replace with your image path
          alt="Homestay Login Banner"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
          priority
        />
        {/* <div className="absolute z-10 text-center px-4">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Welcome to Homestay Admin
          </h1>
          <p className="mt-2 text-lg text-gray-200">
            Manage your bookings and reservations seamlessly.
          </p>
        </div> */}
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-fade-in">
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500 text-center">Sign in to continue</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Username or Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your username or email"
                        {...field}
                        className="border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          {...field}
                          className="border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />

              <Button
                className="w-full bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 rounded-lg py-3 transition-all"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
