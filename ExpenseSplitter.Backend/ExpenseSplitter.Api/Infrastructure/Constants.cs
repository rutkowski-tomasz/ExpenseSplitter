namespace ExpenseSplitter.Api.Infrastructure
{
    public static class Constants
    {
        public const string PublicRouteName = "/public";

        public const int UidLength = 16;
        public const int ExpenseNameLength = 50;
        public const string ExpenseValueType = "decimal(12, 2)";
        public const int ParticipantNameLength = 20;
        public const int TripNameLength = 40;
        public const int TripDescriptionLength = 50;
        public const int UserEmailLength = 50;
        public const int UserPasswordLength = 100;
        public const int UserNameLength = 40;
        public const int UserNickLength = 40;

        public const int UidGenerateLength = 6;
        public const bool UidGenerateAllowDuplicates = true;

        public const string UserIdClaimKey = "UserId";
    }
}
