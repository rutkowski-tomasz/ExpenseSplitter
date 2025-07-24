import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useToast } from '~/hooks/use-toast';
import { useJoinSettlementMutation } from './join-settlement-api';
import { joinSettlementFormSchema, type JoinSettlementFormData } from './join-settlement-models';
import { useState } from 'react';

export function JoinSettlement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const joinMutation = useJoinSettlementMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<JoinSettlementFormData>({
    resolver: zodResolver(joinSettlementFormSchema),
    defaultValues: {
      inviteCode: '',
    },
  });

  const handleJoin = async (data: JoinSettlementFormData) => {
    setFormError(null);
    const result = await joinMutation.mutateAsync({
      body: {
        inviteCode: data.inviteCode,
      },
    });
    result.match(
      (settlementId) => {
        toast({
          title: 'Success',
          description: 'Joined settlement successfully!',
        });
        navigate(`/settlements/${settlementId}`);
      },
      (errorMessage) => {
        setFormError(errorMessage);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Join Settlement</h1>
            <p className="text-sm text-muted-foreground">Enter an invite code to join</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-6">
        <Card className="shadow-card border-0">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Join a Settlement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleJoin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteCode">Invite Code</Label>
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder="Enter invite code or link"
                  className="h-12 rounded-xl"
                  {...form.register('inviteCode')}
                  disabled={joinMutation.isPending}
                />
                <div className="text-destructive text-sm">
                  {form.formState.errors.inviteCode?.message || formError}
                </div>
              </div>
              <Button 
                type="submit"
                disabled={joinMutation.isPending}
                className="w-full h-12"
              >
                {joinMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Join Settlement'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">How to join a settlement</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. Get an invite code from a settlement member</p>
              <p>2. Enter the code or link above and tap "Join Settlement"</p>
              <p>3. You'll be added to the settlement and can start adding expenses</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 