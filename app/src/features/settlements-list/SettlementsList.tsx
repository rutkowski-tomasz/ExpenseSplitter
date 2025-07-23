import { Plus, Search, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { SettlementCard } from '~/components/SettlementCard';
import { Card, CardContent } from '~/components/ui/card';
import { getAllSettlementsQuery } from './settlements-list-api';
import { formatLastActivity } from '~/lib/utils';

interface SettlementsListProps {
}

export function SettlementsList({ }: SettlementsListProps) {
  const navigate = useNavigate();
  const { data: settlementsData, isLoading, error, refetch } = getAllSettlementsQuery(1, 50);

  const settlements = settlementsData?.settlements || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Your Settlements</h2>
          <span className="text-sm text-muted-foreground">...</span>
        </div>
        
        <Card className="shadow-card border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
            <h3 className="font-semibold mb-2">Loading settlements...</h3>
            <p className="text-sm text-muted-foreground">Please wait while we fetch your data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Your Settlements</h2>
          <span className="text-sm text-muted-foreground">Error</span>
        </div>
        
        <Card className="shadow-card border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Failed to load settlements</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (settlements.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Your Settlements</h2>
          <span className="text-sm text-muted-foreground">0 settlements</span>
        </div>
        
        <Card className="shadow-card border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No settlements found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first settlement to get started
            </p>
            <Button onClick={() => navigate('/create-settlement')}>
              <Plus className="mr-2 w-4 h-4" />
              Create Settlement
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Settlements</h2>
        <span className="text-sm text-muted-foreground">
          {settlements.length} settlements
        </span>
      </div>
      
      {settlements.map(settlement => (
        <SettlementCard
          key={settlement.id}
          settlement={{
            id: settlement.id,
            name: settlement.name,
            participantCount: settlement.participantCount,
            totalExpenses: settlement.totalExpenses,
            lastActivity: formatLastActivity(settlement.lastActivity),
            userBalance: settlement.userBalance,
          }}
          onClick={() => navigate(`/settlement/${settlement.id}`)}
        />
      ))}
    </div>
  );
}
