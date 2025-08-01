import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, X, Calculator, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useCreateExpenseMutation, useUpdateExpenseMutation } from './expense-form-api';
import { useGetSettlementQuery } from '~/features/settlement-details/settlement-details-api';
import { useGetExpenseAndSettlementQuery } from '~/features/expense-details/expense-details-api';
import { expenseFormSchema, type ExpenseFormData } from './expense-form-models';
import { toast } from '~/hooks/use-toast';
import { Helmet } from 'react-helmet';
import { ParticipantName } from '../participant-name/ParticipantName';
import { Loading } from '../loading/Loading';

interface ExpenseFormProps {
  expenseId?: string;
}

export function ExpenseForm({ expenseId: propExpenseId }: ExpenseFormProps) {
  const { settlementId, expenseId: paramExpenseId } = useParams<{ settlementId: string; expenseId: string }>();
  const expenseId = propExpenseId || paramExpenseId;
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!expenseId;
  const formInitialized = useRef(false);
  
  const createMutation = useCreateExpenseMutation();
  const updateMutation = useUpdateExpenseMutation();
  
  const { data: settlement, isLoading: isLoadingSettlement } = useGetSettlementQuery(
    settlementId || ''
  );
  
  const { data: existingExpense, isLoading: isLoadingExpense } = useGetExpenseAndSettlementQuery(
    expenseId || '',
    settlementId || '',
    { enabled: isEditMode && !!expenseId && !!settlementId }
  );

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      name: '',
      paymentDate: new Date().toISOString().split('T')[0],
      payingParticipantId: '',
      allocations: [],
    },
  });

  const watchedAllocations = form.watch('allocations');
  const totalAmount = watchedAllocations.reduce((sum, allocation) => sum + allocation.value, 0);

  useEffect(() => {
    // Only initialize form once to prevent overriding user changes
    if (formInitialized.current) return;

    // Prefill from query param if present and not in edit mode
    if (!isEditMode && location.search.includes('prefill=')) {
      try {
        const params = new URLSearchParams(location.search);
        const prefillRaw = params.get('prefill');
        if (prefillRaw) {
          const prefill = JSON.parse(decodeURIComponent(prefillRaw));
          if (prefill.name) form.setValue('name', prefill.name);
          if (prefill.paymentDate) form.setValue('paymentDate', prefill.paymentDate);
          if (prefill.payingParticipantId) form.setValue('payingParticipantId', prefill.payingParticipantId);
          if (Array.isArray(prefill.allocations)) form.setValue('allocations', prefill.allocations);
          formInitialized.current = true;
          return;
        }
      } catch {}
    }

    if (isEditMode && existingExpense) {
      // Populate form with existing expense data
      form.setValue('name', existingExpense.title);
      form.setValue('paymentDate', existingExpense.paymentDate);
      form.setValue('payingParticipantId', existingExpense.payingParticipantId);
      form.setValue('allocations', existingExpense.allocations.map(allocation => ({
        participantId: allocation.participantId,
        value: allocation.amount,
      })));
      formInitialized.current = true;
    } else if (settlement && settlement.participants.length > 0 && !isEditMode) {
      // Initialize form for new expense
      const claimedId = settlement.claimedParticipantId;
      if (claimedId && settlement.participants.some(p => p.id === claimedId)) {
        form.setValue('payingParticipantId', claimedId);
      } else if (!form.getValues('payingParticipantId')) {
        form.setValue('payingParticipantId', settlement.participants[0].id);
      }
      formInitialized.current = true;
    }
  }, [settlement, existingExpense, isEditMode, form, location.search]);

  // Separate effect for initializing allocations in new expense mode
  useEffect(() => {
    if (!isEditMode && settlement && settlement.participants.length > 0 && watchedAllocations.length === 0) {
      const initialAllocations = settlement.participants.map(participant => ({
        participantId: participant.id,
        value: 0,
      }));
      form.setValue('allocations', initialAllocations);
    }
  }, [settlement, isEditMode, watchedAllocations.length, form]);

  const handleSplitEquallyClick = () => {
    if (!settlement || totalAmount === 0) return;
    
    const equalAmount = totalAmount / settlement.participants.length;
    const updatedAllocations = settlement.participants.map(participant => ({
      participantId: participant.id,
      value: Math.round(equalAmount * 100) / 100,
    }));
    
    form.setValue('allocations', updatedAllocations);
  };

  const handleAllocationChange = (participantId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const currentAllocations = form.getValues('allocations');
    const updatedAllocations = currentAllocations.map(allocation =>
      allocation.participantId === participantId
        ? { ...allocation, value: numValue }
        : allocation
    );
    form.setValue('allocations', updatedAllocations);
  };

  const onSubmit = (data: ExpenseFormData) => {
    if (!settlementId) return;
    
    if (isEditMode && expenseId) {
      const payload = {
        expenseId,
        settlementId,
        body: {
          title: data.name.trim(),
          paymentDate: data.paymentDate,
          payingParticipantId: data.payingParticipantId,
          allocations: data.allocations.map(allocation => ({
            participantId: allocation.participantId,
            value: allocation.value,
          })),
        },
      };
      
      updateMutation.mutate(payload, {
        onSuccess: () => {
          toast({
            title: "Expense updated",
            description: "The expense has been successfully updated.",
          });
          navigate(`/settlements/${settlementId}`);
        },
        onError: (error) => {
          toast({
            title: "Update failed",
            description: error instanceof Error ? error.message : "Failed to update expense.",
            variant: "destructive",
          });
        },
      });
    } else {
      const payload = {
        body: {
          name: data.name.trim(),
          paymentDate: data.paymentDate,
          settlementId,
          payingParticipantId: data.payingParticipantId,
          allocations: data.allocations.map(allocation => ({
            participantId: allocation.participantId,
            value: allocation.value,
          })),
        },
      };
      
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast({
            title: "Expense created",
            description: "The expense has been successfully created.",
          });
          navigate(`/settlements/${settlementId}`);
        },
        onError: (error) => {
          toast({
            title: "Creation failed",
            description: error instanceof Error ? error.message : "Failed to create expense.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isLoading = isLoadingSettlement || (isEditMode && isLoadingExpense);

  if (isLoading)
    return <Loading />;

  if (!settlement) {
    return null;
  }

  const getParticipantName = (participantId: string): string => {
    const participant = settlement.participants.find(p => p.id === participantId);
    return participant?.nickname || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>{isEditMode ? 'Edit Expense' : 'Add Expense'}</title>
      </Helmet>
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/settlements/${settlementId}`)}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">
              {isEditMode ? 'Edit Expense' : 'Add Expense'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditMode ? 'Update expense details' : 'Add a new expense to split'}
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-6">
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Expense Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Restaurant dinner, Gas, Hotel"
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

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input
                id="paymentDate"
                type="date"
                {...form.register('paymentDate')}
                className="h-12 rounded-xl"
                disabled={isSubmitting}
              />
              {form.formState.errors.paymentDate && (
                <div className="text-destructive text-sm mt-1">
                  {form.formState.errors.paymentDate.message}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payingParticipant">Who Paid</Label>
              <Select
                value={form.watch('payingParticipantId')}
                onValueChange={(value) => form.setValue('payingParticipantId', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {settlement.participants.map((participant) => (
                    <SelectItem key={participant.id} value={participant.id}>
                      <ParticipantName
                        name={participant.nickname}
                        isClaimed={participant.id === settlement.claimedParticipantId}
                      />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.payingParticipantId && (
                <div className="text-destructive text-sm mt-1">
                  {form.formState.errors.payingParticipantId.message}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Split Details</CardTitle>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-lg font-semibold">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleSplitEquallyClick}
                className="flex-1 h-12"
                disabled={isSubmitting || totalAmount === 0}
              >
                <Calculator className="mr-2 w-4 h-4" />
                Split Equally
              </Button>
            </div>

            <div className="space-y-3">
              {settlement.participants.map((participant, index) => {
                const allocation = watchedAllocations.find(a => a.participantId === participant.id);
                return (
                  <div key={participant.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">
                        <ParticipantName
                          name={participant.nickname}
                          isClaimed={participant.id === settlement.claimedParticipantId}
                        />
                      </Label>
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={allocation?.value || ''}
                        onChange={(e) => handleAllocationChange(participant.id, e.target.value)}
                        className="h-10 text-right"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {form.formState.errors.allocations && (
              <div className="text-destructive text-sm mt-1">
                {form.formState.errors.allocations.message}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Button 
          type="submit"
          disabled={isSubmitting || totalAmount === 0}
          className="w-full h-14"
        >
          {isSubmitting 
            ? (isEditMode ? 'Updating...' : 'Creating...') 
            : (isEditMode ? 'Update Expense' : 'Create Expense')
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