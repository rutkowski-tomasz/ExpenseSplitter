import { Loader2 } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

export function CardLoading() {
    return (
        <Card className="shadow-card border-0">
            <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                </div>
                <h3 className="font-semibold mb-2">Loading...</h3>
                <p className="text-sm text-muted-foreground">Please wait while we fetch your data</p>
            </CardContent>
        </Card>
    );
} 