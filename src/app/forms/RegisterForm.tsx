'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'; 
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username is required',
  }),
  email: z.string().email({
    message: 'Please enter a valid email',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  name: z.string().min(2, {
    message: 'Name is required',
  }),
  role: z.string().min(1, {
    message: 'Role is required',
  }),
});

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      name: '',
      role: 'user', // Default role is 'user'
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'An unexpected error occurred',
        }));
        throw new Error(errorData.error || 'Failed to register');
      }

      const data = await response.json();

      // Redirect to login page after successful registration
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600">
      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-fade-in">
              <AlertTitle>Registration Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>
          <p className="text-sm text-gray-500 text-center">Sign up to get started</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your username"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
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
                      <Input
                        type="password"
                        placeholder="Enter your password"
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Role</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">Superadmin</SelectItem>
                        </SelectContent>
                      </Select>
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
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
