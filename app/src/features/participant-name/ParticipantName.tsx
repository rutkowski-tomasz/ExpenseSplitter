import { Badge } from "~/components/ui/badge";

interface ParticipantNameProps {
  name: string;
  isClaimed: boolean;
}

export function ParticipantName({ name, isClaimed }: ParticipantNameProps) {

    if (!isClaimed) {
        return <>{name}</>;
    }

    return <div className="inline-flex items-center">
        {name}
        <Badge variant="secondary" className="inline-flex mx-2">
            You
        </Badge>
    </div>;
} 