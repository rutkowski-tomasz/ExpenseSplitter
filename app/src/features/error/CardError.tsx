import { DollarSign } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

export function CardError() {
    return (
        <Card className="shadow-card border-0">
            <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Failed to load</h3>
                <p className="text-sm text-muted-foreground">Please check your connection and try again</p>
            </CardContent>
        </Card>
    );
} 