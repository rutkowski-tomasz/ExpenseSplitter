import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Share2, MoreVertical, DollarSign, Loader2, Edit, Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '~/components/ui/alert-dialog';
import { toast } from '~/hooks/use-toast';
import { useGetSettlementQuery, useDeleteSettlementMutation } from './settlement-details-api';
import { SettlementBalances } from '~/features/settlement-balances/SettlementBalances';
import { ExpensesList } from '~/features/expenses-list/ExpensesList';
import { useGetExpensesForSettlementQuery } from '~/features/expenses-list/expenses-list-api';

export function SettlementDetails() {
  const { settlementId } = useParams<{ settlementId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('expenses');
  
  const { data: settlement, isLoading, error } = useGetSettlementQuery(settlementId || '');
  const { data: expensesData } = useGetExpensesForSettlementQuery(settlementId || '');
  const deleteSettlementMutation = useDeleteSettlementMutation();

  const handleShare = async () => {
    if (!settlement) return;
    
    const shareUrl = `${window.location.origin}/join-settlement?inviteCode=${settlement.inviteCode}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Settlement invite link has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    navigate(`/settlements/${settlementId}/edit`);
  };

  const handleDelete = () => {
    if (!settlementId) return;
    
    deleteSettlementMutation.mutate(settlementId, {
      onSuccess: () => {
        toast({
          title: "Settlement deleted",
          description: "The settlement has been successfully deleted.",
        });
        navigate('/dashboard');
      },
      onError: (error) => {
        toast({
          title: "Delete failed",
          description: error instanceof Error ? error.message : "Failed to delete settlement.",
          variant: "destructive",
        });
      },
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
              onClick={() => navigate('/dashboard')}
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
              <h3 className="font-semibold mb-2">Loading settlement...</h3>
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
              onClick={() => navigate('/dashboard')}
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
                <DollarSign className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">Failed to load settlement</h3>
              <p className="text-sm text-muted-foreground">Please check your connection and try again</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!settlement) {
    return null;
  }

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
            <h1 className="text-xl font-bold text-foreground">{settlement.name}</h1>
            <p className="text-sm text-muted-foreground">{settlement.participants.length} participants</p>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
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
                      <AlertDialogTitle>Delete Settlement</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{settlement?.name}"? This action cannot be undone and all associated expenses will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={deleteSettlementMutation.isPending}
                      >
                        {deleteSettlementMutation.isPending ? 'Deleting...' : 'Delete'}
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
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-foreground">${settlement.totalCost.toFixed(2)}</div>
              <div className="text-muted-foreground">Total group spending</div>
              
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {settlement.yourCost ? `$${settlement.yourCost.toFixed(2)}` : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">Your cost</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">
                    {expensesData?.expenses?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Expenses</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={() => navigate(`/settlements/${settlementId}/expenses/add`)}
          className="w-full h-14"
        >
          <Plus className="mr-2 w-5 h-5" />
          Add New Expense
        </Button>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-white rounded-xl shadow-card border-0">
            <TabsTrigger value="expenses" className="rounded-lg">Expenses</TabsTrigger>
            <TabsTrigger value="balances" className="rounded-lg">Balances</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-4">
            <ExpensesList 
              settlementId={settlementId || ''} 
              participants={settlement.participants} 
            />
          </TabsContent>

          <TabsContent value="balances" className="space-y-4">
            <SettlementBalances 
              settlementId={settlementId || ''} 
              participants={settlement.participants} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
