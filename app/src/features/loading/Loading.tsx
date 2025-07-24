import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export function Loading() {

    const navigate = useNavigate();

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
                <h3 className="font-semibold mb-2">Loading...</h3>
                <p className="text-sm text-muted-foreground">Please wait while we fetch your data</p>
              </CardContent>
            </Card>
          </div>
        </div>
    );
};