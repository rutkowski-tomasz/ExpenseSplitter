import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Share2, MoreVertical, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useGetSettlementQuery } from './settlement-details-api';
import { SettlementBalances } from '~/features/settlement-balances/SettlementBalances';

// Mock data for development (to be replaced with API data)
const mockExpenses = [
  {
    id: '1',
    name: 'Hotel Booking',
    amount: 240.00,
    paidBy: '1',
    paidByName: 'You',
    date: 'Mar 15, 2024',
    participantCount: 4,
    userShare: 60.00,
  },
  {
    id: '2',
    name: 'Gas Station',
    amount: 80.00,
    paidBy: '2',
    paidByName: 'Alice',
    date: 'Mar 14, 2024',
    participantCount: 4,
    userShare: 20.00,
  },
  {
    id: '3',
    name: 'Restaurant Dinner',
    amount: 130.00,
    paidBy: '3',
    paidByName: 'Bob',
    date: 'Mar 14, 2024',
    participantCount: 4,
    userShare: 32.50,
  },
];

const mockBalances = [
  { id: '1', name: 'You', balance: 75.50 },
  { id: '2', name: 'Alice', balance: -25.00 },
  { id: '3', name: 'Bob', balance: -30.50 },
  { id: '4', name: 'Carol', balance: -20.00 },
];

const mockReimbursements = [
  { from: 'Alice', to: 'You', amount: 25.00 },
  { from: 'Bob', to: 'You', amount: 30.50 },
  { from: 'Carol', to: 'You', amount: 20.00 },
];

export function SettlementDetails() {
  const { settlementId } = useParams<{ settlementId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('expenses');
  
  const { data: settlement, isLoading, error } = useGetSettlementQuery(settlementId || '');



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

  const totalExpenses = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);

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
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
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
                  <div className="text-lg font-semibold text-foreground">0</div>
                  <div className="text-xs text-muted-foreground">Expenses</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={() => navigate(`/settlement/${settlementId}/add-expense`)}
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
