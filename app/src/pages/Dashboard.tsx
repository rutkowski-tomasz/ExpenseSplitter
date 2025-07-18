import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, LogOutIcon, JoystickIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SettlementCard } from '@/components/SettlementCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { settlementsApi, removeAuthToken, getAuthToken } from '@/lib/api';

interface Settlement {
  id: string;
  name: string;
  participantCount: number;
  totalExpenses: number;
  lastActivity: string;
  userBalance: number;
}

interface DashboardProps {
  onNavigate: (page: string, data?: any) => void;
  onLogout: () => void;
}

// Helper function to format date for display
const formatLastActivity = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

export function Dashboard({ onNavigate, onLogout }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data: settlementsData, isLoading, error } = useQuery({
    queryKey: ['settlements', 1, 50], // page=1, pageSize=50
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      return settlementsApi.getAll(1, 50);
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!getAuthToken(), // Only run query if user is authenticated
  });

  const settlements = settlementsData?.settlements || [];

  const filteredSettlements = settlements.filter(settlement =>
    settlement.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    removeAuthToken();
    onLogout();
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  // Handle error state
  if (error) {
    // Check if it's an authentication error
    if (error instanceof Error && error.message.includes('401')) {
      removeAuthToken();
      onLogout();
      return null; // Don't render anything as we're redirecting
    }
    
    toast({
      title: "Error loading settlements",
      description: error instanceof Error ? error.message : "Failed to load settlements",
      variant: "destructive",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">ES</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ExpenseSplitter</h1>
              <p className="text-sm text-muted-foreground">Welcome back!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOutIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => onNavigate('createSettlement')}
            className="h-16 flex-col gap-2"
          >
            <Plus className="w-6 h-6" />
            <span>New Settlement</span>
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => onNavigate('joinSettlement')}
            className="h-16 flex-col gap-2"
          >
            <JoystickIcon className="w-6 h-6" />
            <span>Join Settlement</span>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Your Settlements</h2>
            <span className="text-sm text-muted-foreground">
              {isLoading ? '...' : `${filteredSettlements.length} settlements`}
            </span>
          </div>
          
          {isLoading ? (
            <Card className="shadow-card border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                </div>
                <h3 className="font-semibold mb-2">Loading settlements...</h3>
                <p className="text-sm text-muted-foreground">Please wait while we fetch your data</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="shadow-card border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Failed to load settlements</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {error instanceof Error ? error.message : "Something went wrong"}
                </p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : filteredSettlements.length === 0 ? (
            <Card className="shadow-card border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No settlements found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery ? 'Try a different search term' : 'Create your first settlement to get started'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => onNavigate('createSettlement')}>
                    <Plus className="mr-2 w-4 h-4" />
                    Create Settlement
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredSettlements.map(settlement => (
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
                onClick={() => onNavigate('settlement', { id: settlement.id })}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}