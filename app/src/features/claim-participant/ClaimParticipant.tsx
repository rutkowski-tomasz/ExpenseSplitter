import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, DollarSign } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useGetSettlementQuery, useClaimParticipantMutation } from './claim-participant-api';
import { Helmet } from 'react-helmet';

export function ClaimParticipant() {
  const { settlementId } = useParams<{ settlementId: string }>();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  
  const { data: settlement, isLoading, error } = useGetSettlementQuery(settlementId || '');
  const claimParticipantMutation = useClaimParticipantMutation();

  const handleClaimParticipant = (participantId: string) => {
    if (!settlementId) return;
    
    setFormError(null);
    claimParticipantMutation.mutate(
      { settlementId, participantId },
      {
        onSuccess: () => {
          navigate(`/settlements/${settlementId}`);
        },
        onError: (error) => {
          setFormError(error instanceof Error ? error.message : "Failed to claim participant. Please try again.");
        },
      }
    );
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
      <Helmet>
        <title>Who are you? - {settlement.name}</title>
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
            <h1 className="text-xl font-bold text-foreground">Who are you?</h1>
            <p className="text-sm text-muted-foreground">Select your participant from {settlement.name}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Select your participant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {settlement.participants.map((participant) => (
                <Button
                  key={participant.id}
                  className="w-full"
                  disabled={claimParticipantMutation.isPending}
                  onClick={() => handleClaimParticipant(participant.id)}
                >
                  {participant.nickname}
                </Button>
              ))}
              {claimParticipantMutation.isPending && (
                <div className="flex justify-center mt-4">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              )}
              {formError && (
                <div className="text-destructive text-center text-sm mt-2">
                  {formError}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 