import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '~/components/ui/alert-dialog';
import { toast } from '~/hooks/use-toast';
import { useDeleteExpenseMutation } from '~/features/expense-details/expense-details-api';

interface ExpenseMenuProps {
  expenseId: string;
  settlementId: string;
  expenseTitle: string;
}

export function ExpenseMenu({
  expenseId,
  settlementId,
  expenseTitle,
}: ExpenseMenuProps) {
  const navigate = useNavigate();
  const deleteExpenseMutation = useDeleteExpenseMutation();

  const handleEdit = () => {
    navigate(`/settlements/${settlementId}/expenses/${expenseId}/edit`);
  };

  const handleDelete = () => {
    deleteExpenseMutation.mutate({ expenseId }, {
      onSuccess: () => {
        toast({
          title: "Expense deleted",
          description: "The expense has been successfully deleted.",
        });
        navigate(`/settlements/${settlementId}`);
      },
      onError: (error) => {
        toast({
          title: "Delete failed",
          description: error instanceof Error ? error.message : "Failed to delete expense.",
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
              <AlertDialogTitle>Delete Expense</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{expenseTitle}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteExpenseMutation.isPending}
              >
                {deleteExpenseMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 