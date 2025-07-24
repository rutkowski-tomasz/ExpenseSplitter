import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Error() {
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
                <h3 className="font-semibold mb-2">Failed to load</h3>
                <p className="text-sm text-muted-foreground">Please check your connection and try again</p>
                </CardContent>
            </Card>
            </div>
        </div>
    );
}
