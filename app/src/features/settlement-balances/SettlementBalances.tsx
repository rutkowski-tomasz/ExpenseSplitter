import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Loader2, DollarSign } from 'lucide-react';
import { useGetSettlementBalancesQuery } from './settlement-balances-api';
import { ParticipantName } from '../participant-name/ParticipantName';

interface Participant {
  id: string;
  nickname: string;
}

interface SettlementBalancesProps {
  settlementId: string;
  participants: Participant[];
  claimedParticipantId?: string;
}

export function SettlementBalances({ settlementId, participants, claimedParticipantId }: SettlementBalancesProps) {
  const { data: reimbursementData, isLoading, error } = useGetSettlementBalancesQuery(settlementId);

  const getParticipantName = (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    return participant?.nickname || 'Unknown';
  };

  if (isLoading) {
    return (
      <Card className="shadow-card border-0">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          </div>
          <h3 className="font-semibold mb-2">Loading balances...</h3>
          <p className="text-sm text-muted-foreground">Please wait while we calculate balances</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-card border-0">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="font-semibold mb-2">Failed to load balances</h3>
          <p className="text-sm text-muted-foreground">Please check your connection and try again</p>
        </CardContent>
      </Card>
    );
  }

  if (!reimbursementData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {reimbursementData.balances.map(balance => {
          const participantName = getParticipantName(balance.participantId);
          return (
            <Card key={balance.participantId} className="shadow-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary-light text-primary">
                        {participantName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        <ParticipantName
                          name={participantName}
                          isClaimed={balance.participantId === claimedParticipantId}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {balance.value > 0 ? 'Gets back' : balance.value < 0 ? 'Owes' : 'Settled up'}
                      </div>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={balance.value > 0 ? "default" : balance.value < 0 ? "destructive" : "secondary"}
                    className={`
                      font-medium rounded-full
                      ${balance.value > 0 ? 'bg-green-100 text-green-700' : ''}
                      ${balance.value < 0 ? 'bg-red-100 text-red-700' : ''}
                      ${balance.value === 0 ? 'bg-gray-100 text-gray-700' : ''}
                    `}
                  >
                    {balance.value !== 0 && (balance.value > 0 ? '+' : '')}
                    ${Math.abs(balance.value).toFixed(2)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Suggested Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reimbursementData.suggestedReimbursements.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800 mb-2">You're all settled up!</h3>
              <p className="text-sm text-muted-foreground">No payments needed at this time.</p>
            </div>
          ) : (
            reimbursementData.suggestedReimbursements.map((reimbursement, index) => {
              const fromParticipantName = getParticipantName(reimbursement.fromParticipantId);
              const toParticipantName = getParticipantName(reimbursement.toParticipantId);
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-light rounded-xl">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-white text-primary">
                        {fromParticipantName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <span className="font-medium">
                        <ParticipantName
                          name={fromParticipantName}
                          isClaimed={reimbursement.fromParticipantId === claimedParticipantId}
                        />  
                      </span>
                      <span className="text-muted-foreground"> pays </span>
                      <span className="font-medium">
                        <ParticipantName
                          name={toParticipantName}
                          isClaimed={reimbursement.toParticipantId === claimedParticipantId}
                        />
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${reimbursement.value.toFixed(2)}</div>
                    <Button size="sm" variant="secondary" className="mt-1 h-6 text-xs">
                      Settle
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
} 