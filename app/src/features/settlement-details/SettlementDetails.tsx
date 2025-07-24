import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useGetSettlementQuery } from './settlement-details-api';
import { SettlementBalances } from '~/features/settlement-balances/SettlementBalances';
import { ExpensesList } from '~/features/expenses-list/ExpensesList';
import { useGetExpensesForSettlementQuery } from '~/features/expenses-list/expenses-list-api';
import { useAuthStore } from '~/stores/authStore';
import { Helmet } from 'react-helmet';
import { Loading } from '../loading/Loading';
import { Error } from '../error/Error';
import { SettlementMenu } from '~/features/settlement-menu/SettlementMenu';

export function SettlementDetails() {
  const { settlementId } = useParams<{ settlementId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('expenses');
  const { userId } = useAuthStore();
  
  const { data: settlement, isLoading, error } = useGetSettlementQuery(settlementId || '');
  const { data: expensesData } = useGetExpensesForSettlementQuery(settlementId || '');

  if (isLoading)
    return <Loading />;

  if (error || !settlement)
    return <Error />;

  if (!settlement.claimedParticipantId) {
    navigate(`/settlements/${settlementId}/claim`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>{settlement.name}</title>
      </Helmet>
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
            <SettlementMenu
              settlementName={settlement.name}
              isCreator={userId === settlement.creatorUserId}
              settlementId={settlementId || ''}
              settlementInviteCode={settlement.inviteCode}
            />
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
          onClick={() => navigate(`/settlements/${settlementId}/expenses/create`)}
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
              claimedParticipantId={settlement.claimedParticipantId}
            />
          </TabsContent>

          <TabsContent value="balances" className="space-y-4">
            <SettlementBalances 
              settlementId={settlementId || ''} 
              participants={settlement.participants} 
              claimedParticipantId={settlement.claimedParticipantId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
