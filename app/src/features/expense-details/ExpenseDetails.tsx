import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MoreVertical, Edit, Trash2, Receipt, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '~/components/ui/alert-dialog';
import { toast } from '~/hooks/use-toast';
import { useGetExpenseAndSettlementQuery, useDeleteExpenseMutation } from './expense-details-api';
import { Helmet } from 'react-helmet';

export function ExpenseDetails() {
  const { settlementId, expenseId } = useParams<{ settlementId: string; expenseId: string }>();
  const navigate = useNavigate();
  
  const { data: expense, isLoading, error } = useGetExpenseAndSettlementQuery(expenseId || '', settlementId || '');
  const deleteExpenseMutation = useDeleteExpenseMutation();

  const handleEdit = () => {
    if (settlementId && expenseId) {
      navigate(`/settlements/${settlementId}/expenses/${expenseId}/edit`);
    }
  };

  const handleDelete = () => {
    if (!expenseId) return;
    
    deleteExpenseMutation.mutate({ expenseId }, {
      onSuccess: () => {
        toast({
          title: "Expense deleted",
          description: "The expense has been successfully deleted.",
        });
        navigate(`/settlements/${settlementId}`);
      },
      onError: (error) => {
        toast({
          title: "Delete failed",
          description: error instanceof Error ? error.message : "Failed to delete expense.",
          variant: "destructive",
        });
      },
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="bg-white border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <div className="h-6 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <Card className="shadow-card border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
              </div>
              <h3 className="font-semibold mb-2">Loading expense...</h3>
              <p className="text-sm text-muted-foreground">Please wait while we fetch your data</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="bg-white border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Error</h1>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <Card className="shadow-card border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">Failed to load expense</h3>
              <p className="text-sm text-muted-foreground">Please check your connection and try again</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!expense) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>{expense.title}</title>
      </Helmet>
      {/* Header */}
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
            <h1 className="text-xl font-bold text-foreground">{expense.title}</h1>
            <p className="text-sm text-muted-foreground">{expense.settlementName}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{expense.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={deleteExpenseMutation.isPending}
                      >
                        {deleteExpenseMutation.isPending ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Expense Summary */}
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-foreground">${expense.amount.toFixed(2)}</div>
              <div className="text-muted-foreground">Total amount</div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(expense.paymentDate)}</span>
              </div>
              
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">
                    ${(expense.amount / expense.allocations.length).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Per person</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">{expense.allocations.length}</div>
                  <div className="text-xs text-muted-foreground">People</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paid By */}
        <Card className="shadow-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Paid by</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary-light text-primary">
                  {expense.payingParticipantName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">{expense.payingParticipantName}</div>
                <div className="text-sm text-muted-foreground">Paid ${expense.amount.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Split Details */}
        <Card className="shadow-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Split details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expense.allocations.map((allocation) => (
              <div key={allocation.participantId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-primary-light text-primary">
                      {allocation.participantName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{allocation.participantName}</span>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  ${allocation.amount.toFixed(2)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 