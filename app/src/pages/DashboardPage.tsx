import { LogOutIcon, JoystickIcon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { useAuthStore } from '~/stores/authStore';
import { SettlementsList } from '~/features/settlements-list/SettlementsList';
import { Helmet } from 'react-helmet';

export function DashboardPage() {
  const navigate = useNavigate();
  const { username, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>Dashboard - ExpenseSplitter</title>
      </Helmet>
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">ES</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ExpenseSplitter</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back{username ? `, ${username}` : ''}!
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => logout()}>
              <LogOutIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => navigate('/settlements/create')}
            className="h-16 flex-col gap-2"
          >
            <Plus className="w-6 h-6" />
            <span>New Settlement</span>
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => navigate('/settlements/join')}
            className="h-16 flex-col gap-2"
          >
            <JoystickIcon className="w-6 h-6" />
            <span>Join Settlement</span>
          </Button>
        </div>

        <SettlementsList />
      </div>
    </div>
  );
}