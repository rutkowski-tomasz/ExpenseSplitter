import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Badge } from '~/components/ui/badge';
import { useCreateSettlementMutation, useUpdateSettlementMutation } from './settlement-form-api';
import { useGetSettlementQuery } from '~/features/settlement-details/settlement-details-api';
import { settlementFormSchema, type SettlementFormData } from './settlement-form-models';
import { GetSettlementResponseParticipant } from '~/features/settlement-details/settlement-details-models';
import { useAuthStore } from '~/stores/authStore';
import { Helmet } from 'react-helmet';
import { Loading } from '../loading/Loading';

export function SettlementForm() {
  const { settlementId } = useParams<{ settlementId: string }>();
  const navigate = useNavigate();
  const isEditMode = !!settlementId;
  const [originalParticipants, setOriginalParticipants] = useState<GetSettlementResponseParticipant[]>([]);
  const { username } = useAuthStore();
  
  const createMutation = useCreateSettlementMutation();
  const updateMutation = useUpdateSettlementMutation();
  
  const { data: settlement, isLoading: isLoadingSettlement } = useGetSettlementQuery(
    settlementId || '',
    { enabled: isEditMode }
  );

  const form = useForm<SettlementFormData>({
    resolver: zodResolver(settlementFormSchema),
    defaultValues: {
      name: '',
      participants: [username || ''],
    },
  });

  const participants = form.watch('participants');

  useEffect(() => {
    if (isEditMode && settlement) {
      setOriginalParticipants(settlement.participants);
      form.reset({
        name: settlement.name,
        participants: settlement.participants.map(p => p.nickname),
      });
    } else if (!isEditMode && username && participants[0] !== username) {
      // Initialize first participant with username for new settlements
      form.setValue('participants.0', username);
    }
  }, [settlement, isEditMode, form, username, participants]);

  const addParticipant = () => {
    form.setValue('participants', [...participants, '']);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      const newParticipants = participants.filter((_, i) => i !== index);
      form.setValue('participants', newParticipants);
    }
  };

  const onSubmit = (data: SettlementFormData) => {
    const validParticipants = data.participants.filter(p => p.trim());
    
    if (isEditMode && settlementId) {
      const participantsWithIds = validParticipants.map((nickname) => {
        const existingParticipant = originalParticipants.find(p => p.nickname === nickname);
        return {
          id: existingParticipant ? existingParticipant.id : null,
          nickname: nickname.trim(),
        };
      });

      const payload = {
        settlementId,
        body: {
          name: data.name.trim(),
          participants: participantsWithIds,
        },
      };
      updateMutation.mutate(payload, {
        onSuccess: () => {
          navigate(`/settlements/${settlementId}`);
        },
      });
    } else {
      const payload = {
        name: data.name.trim(),
        participantNames: validParticipants,
      };
      createMutation.mutate(payload, {
        onSuccess: (id) => {
          navigate(`/settlements/${id}`);
        },
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isLoading = isEditMode && isLoadingSettlement;

  if (isLoading)
    return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>{isEditMode ? 'Edit Settlement' : 'Create Settlement'}</title>
      </Helmet>
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(isEditMode ? `/settlements/${settlementId}` : '/dashboard')}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">
              {isEditMode ? 'Edit Settlement' : 'Create Settlement'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditMode ? 'Update settlement details' : 'Set up a new expense settlement'}
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-6">
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Settlement Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Settlement Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Weekend Trip, Dinner Split"
                {...form.register('name')}
                className="h-12 rounded-xl"
                disabled={isSubmitting}
              />
              {form.formState.errors.name && (
                <div className="text-destructive text-sm mt-1">
                  {form.formState.errors.name.message}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Participants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {participants.map((participant, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder={`Participant ${index + 1} name`}
                    {...form.register(`participants.${index}`)}
                    className="h-12 rounded-xl"
                    disabled={isSubmitting}
                  />
                  {index === 0 && !isEditMode && (
                    <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">
                      You
                    </Badge>
                  )}
                </div>
                {participants.length > 1 && (index > 0 || isEditMode) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeParticipant(index)}
                    className="h-12 w-12 shrink-0"
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {form.formState.errors.participants && (
              <div className="text-destructive text-sm mt-1">
                {form.formState.errors.participants.message}
              </div>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={addParticipant}
              className="w-full h-12"
              disabled={isSubmitting}
            >
              <Plus className="mr-2 w-4 h-4" />
              Add Participant
            </Button>
          </CardContent>
        </Card>
        
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14"
        >
          {isSubmitting 
            ? (isEditMode ? 'Updating...' : 'Creating...') 
            : (isEditMode ? 'Update Settlement' : 'Create Settlement')
          }
        </Button>
        
        {(createMutation.isError || updateMutation.isError) && (
          <div className="text-destructive text-center mt-2 text-sm">
            {createMutation.error instanceof Error 
              ? createMutation.error.message 
              : updateMutation.error instanceof Error 
              ? updateMutation.error.message 
              : 'An error occurred'
            }
          </div>
        )}
      </form>
    </div>
  );
} 