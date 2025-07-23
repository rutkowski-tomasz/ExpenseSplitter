import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useCreateSettlementMutation } from './settlement-create-api';
import { settlementCreateSchema, type SettlementCreateFormData, type CreateSettlementRequest } from './settlement-create-models';

export function SettlementCreate() {
  const navigate = useNavigate();
  const mutation = useCreateSettlementMutation();

  const form = useForm<SettlementCreateFormData>({
    resolver: zodResolver(settlementCreateSchema),
    defaultValues: {
      name: '',
      participants: [''],
    },
  });

  const participants = form.watch('participants');

  const addParticipant = () => {
    form.setValue('participants', [...participants, '']);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      const newParticipants = participants.filter((_, i) => i !== index);
      form.setValue('participants', newParticipants);
    }
  };

  const onSubmit = (data: SettlementCreateFormData) => {
    const validParticipants = data.participants.filter(p => p.trim());
    const payload = {
      name: data.name.trim(),
      participantNames: validParticipants,
    };
    mutation.mutate(
      payload,
      {
        onSuccess: (id) => {
          navigate(`/settlements/${id}`);
        },
      }
    );
  };

  const isSubmitting = mutation.isPending;

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
            <h1 className="text-xl font-bold text-foreground">Create Settlement</h1>
            <p className="text-sm text-muted-foreground">Set up a new expense settlement</p>
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
              <div key={index} className="flex gap-2">
                <Input
                  type="text"
                  placeholder={`Participant ${index + 1} name`}
                  {...form.register(`participants.${index}`)}
                  className="h-12 rounded-xl flex-1"
                  disabled={isSubmitting}
                />
                {participants.length > 1 && (
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
          {isSubmitting ? 'Creating...' : 'Create Settlement'}
        </Button>
        
        {mutation.isError && (
          <div className="text-destructive text-center mt-2 text-sm">
            {mutation.error instanceof Error ? mutation.error.message : 'An error occurred'}
          </div>
        )}
      </form>
    </div>
  );
}
