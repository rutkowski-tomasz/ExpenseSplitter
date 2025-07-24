interface ParticipantNameProps {
  name: string;
  isClaimed: boolean;
}

export function ParticipantName({ name, isClaimed }: ParticipantNameProps) {
  return <>{name} {isClaimed ? ' (You)' : ''}</>
} 