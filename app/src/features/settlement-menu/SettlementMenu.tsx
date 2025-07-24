import { useNavigate } from 'react-router-dom';
import { MoreVertical, Share2, Edit, User, Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '~/components/ui/alert-dialog';
import { toast } from '~/hooks/use-toast';
import { useDeleteSettlementMutation, useLeaveSettlementMutation } from '~/features/settlement-details/settlement-details-api';

interface SettlementMenuProps {
  settlementName: string;
  isCreator: boolean;
  settlementId: string;
  settlementInviteCode: string;
}

export function SettlementMenu({
  settlementName,
  isCreator,
  settlementId,
  settlementInviteCode,
}: SettlementMenuProps) {
  const navigate = useNavigate();
  const deleteSettlementMutation = useDeleteSettlementMutation();
  const leaveSettlementMutation = useLeaveSettlementMutation();

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/settlements/join?inviteCode=${settlementInviteCode}`;
    
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

  const handleClaimParticipant = () => {
    navigate(`/settlements/${settlementId}/claim`);
  };

  const handleDelete = () => {
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

  const handleLeave = () => {
    leaveSettlementMutation.mutate(settlementId, {
      onSuccess: () => {
        toast({
          title: "Left settlement",
          description: "You have successfully left the settlement.",
        });
        navigate('/settlements');
      },
      onError: (error) => {
        toast({
          title: "Leave failed",
          description: error instanceof Error ? error.message : "Failed to leave settlement.",
          variant: "destructive",
        });
      },
    });
  };
  return (
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
        <DropdownMenuItem onClick={handleClaimParticipant}>
          <User className="w-4 h-4 mr-2" />
          Claim participant
        </DropdownMenuItem>
        {isCreator ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete (with all expenses and participants)
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Settlement</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{settlementName}"? This action cannot be undone and all associated expenses will be lost.
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
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2 className="w-4 h-4 mr-2" />
                Leave
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave Settlement</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to leave "{settlementName}"? You will no longer have access to this settlement and its expenses.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleLeave}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={leaveSettlementMutation.isPending}
                >
                  {leaveSettlementMutation.isPending ? 'Leaving...' : 'Leave'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 