import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { useAuthStore } from '~/stores/authStore';
import { LogIn } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Result } from 'neverthrow';
import { registerFormSchema, type RegisterFormData } from './register-models';
import { Helmet } from 'react-helmet';

export function Register() {
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: ({ email, nickname, password }: RegisterFormData) =>
      useAuthStore.getState().register(email, nickname, password),
    onSuccess: (result: Result<boolean, any>) => {
      result.match(
        () => {
          setFormError(null);
          navigate('/login');
        },
        (error) => {
          setFormError(error.detail || error.title || 'Registration failed');
        }
      );
    },
  });

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setFormError(null);
    registerMutation.mutate({
      email: data.email,
      nickname: data.nickname,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Helmet>
        <title>Register</title>
      </Helmet>
      <Card className="w-full max-w-md shadow-card border-0">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">ES</span>
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up for a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  {...form.register('email')}
                  className="h-12 rounded-xl border-border focus:border-primary"
                  disabled={registerMutation.isPending}
                />
                <div className="text-destructive text-sm">{form.formState.errors.email?.message}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname</Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="Nickname"
                  {...form.register('nickname')}
                  className="h-12 rounded-xl border-border focus:border-primary"
                  disabled={registerMutation.isPending}
                />
                <div className="text-destructive text-sm">{form.formState.errors.nickname?.message}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...form.register('password')}
                  className="h-12 rounded-xl border-border focus:border-primary"
                  disabled={registerMutation.isPending}
                />
                <div className="text-destructive text-sm">{form.formState.errors.password?.message || formError}</div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="mr-2" size={18} />
                  Sign Up
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
