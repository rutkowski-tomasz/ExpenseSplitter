import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { useGetExpenseAndSettlementQuery } from './expense-details-api';
import { Helmet } from 'react-helmet';
import { Loading } from '../loading/Loading';
import { Error } from '../error/Error';
import { ParticipantName } from '../participant-name/ParticipantName';
import { ExpenseMenu } from '~/features/expense-menu/ExpenseMenu';

export function ExpenseDetails() {
  const { settlementId, expenseId } = useParams<{ settlementId: string; expenseId: string }>();
  const navigate = useNavigate();
  
  const { data: expense, isLoading, error } = useGetExpenseAndSettlementQuery(expenseId || '', settlementId || '');

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (isLoading)
    return <Loading />;

  if (error)
    return <Error />;

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
            <ExpenseMenu
              expenseId={expenseId || ''}
              settlementId={settlementId || ''}
              expenseTitle={expense.title}
            />
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
            <CardTitle className="text-lg">
              Paid by
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary-light text-primary">
                  {expense.payingParticipantName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">
                  <ParticipantName
                    name={expense.payingParticipantName}
                    isClaimed={expense.payingParticipantId === expense.claimedParticipantId}
                  />
                </div>
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
                  <span className="font-medium">
                    <ParticipantName
                      name={allocation.participantName}
                      isClaimed={allocation.participantId === expense.claimedParticipantId}
                    />
                  </span>
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