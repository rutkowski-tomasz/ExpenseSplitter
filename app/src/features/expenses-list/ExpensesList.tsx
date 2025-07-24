import { Receipt, Calendar, User } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useGetExpensesForSettlementQuery } from './expenses-list-api';
import { ExpenseListItem } from './expenses-list-models';
import { ParticipantName } from '../participant-name/ParticipantName';
import { CardLoading } from '../loading/CardLoading';
import { CardError } from '../error/CardError';

interface ExpensesListProps {
  settlementId: string;
  participants: Array<{ id: string; nickname: string; }>;
  claimedParticipantId?: string;
}

export function ExpensesList({ settlementId, participants, claimedParticipantId }: ExpensesListProps) {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetExpensesForSettlementQuery(settlementId);

  if (isLoading)
    return <CardLoading />;

  if (error)
    return <CardError />;

  if (!data?.expenses?.length) {
    return (
      <Card className="shadow-card border-0">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No expenses yet</h3>
          <p className="text-sm text-muted-foreground">Add your first expense to get started</p>
        </CardContent>
      </Card>
    );
  }

  const getParticipantName = (participantId: string): string => {
    const participant = participants.find(p => p.id === participantId);
    return participant?.nickname || 'Unknown';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const expensesWithParticipantNames: ExpenseListItem[] = data.expenses.map(expense => ({
    ...expense,
    payingParticipantName: getParticipantName(expense.payingParticipantId),
  }));

  return (
    <div className="space-y-3">
      {expensesWithParticipantNames.map((expense) => (
        <Card 
          key={expense.id} 
          className="shadow-card border-0 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(`/settlements/${settlementId}/expenses/${expense.id}`)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Receipt className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">{expense.title}</h3>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>
                      Paid by{' '}
                      <ParticipantName
                        name={expense.payingParticipantName}
                        isClaimed={expense.payingParticipantId === claimedParticipantId}
                      /></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(expense.paymentDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-foreground">
                  ${expense.amount.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 