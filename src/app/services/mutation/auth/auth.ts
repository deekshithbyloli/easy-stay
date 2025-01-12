import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../../api/login/authApi';
import { useToast } from '@/hooks/use-toast';
import { registerUser, verifyOtp } from '../../api/login/registerApi';

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data) => login(data),
    onMutate: () => {},
    onError: (error) => {
      // Extract error message safely
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast({
        variant: 'destructive',
        title: 'Unable to change password',
        description: typeof errorMessage === 'string' ? errorMessage : 'An unknown error occurred'
      });
    },
    onSuccess: () => {
      console.log('success!!!');
      toast({
        variant: 'default',
        title: 'logged in  successfully'
      });
      queryClient.invalidateQueries('passwords');
    }
  });
}

export function useRegisterUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data) => registerUser(data),
    onMutate: () => {},
    onError: (error) => {
      // Extract error message safely
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast({
        variant: 'destructive',
        title: 'Unable to register user',
        description: typeof errorMessage === 'string' ? errorMessage : 'An unknown error occurred'
      });
    },
    onSuccess: () => {
      console.log('success!!!');
      toast({
        variant: 'default',
        title: 'user registered successfully'
      });
      queryClient.invalidateQueries('passwords');
    }
  });
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data) => verifyOtp(data),
    onMutate: () => {},
    onError: (error) => {
      // Extract error message safely
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast({
        variant: 'destructive',
        title: 'Unable to verify otp',
        description: typeof errorMessage === 'string' ? errorMessage : 'An unknown error occurred'
      });
    },
    onSuccess: () => {
      console.log('success!!!');
      toast({
        variant: 'default',
        title: 'user registered successfully'
      });
      queryClient.invalidateQueries('passwords');
    }
  });
}
