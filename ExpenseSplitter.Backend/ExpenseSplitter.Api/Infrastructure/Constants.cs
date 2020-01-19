namespace ExpenseSplitter.Api.Infrastructure
{
    public class Constants
    {
        public const string PublicRouteName = "/public";

        public const int UidLength = 16;
        public const int ExpenseNameMinLength = 3;
        public const int ExpenseNameMaxLength = 50;
        public const string ExpenseValueType = "decimal(12, 2)";
        public const double ExpenseValueMin = 0;
        public const double ExpenseValueMax = 999999999999.99;
        public const int ParticipantNameMinLength = 2;
        public const int ParticipantNameMaxLength = 20;
        public const int TripNameMaxLength = 40;
        public const int TripNameMinLength = 3;
        public const int TripDescriptionMinLength = 0;
        public const int TripDescriptionMaxLength = 50;
        public const int UserEmailMaxLength = 50;
        public const int UserPasswordLength = 100;

        public const int UidGenerateLength = 6;
        public const bool UidGenerateAllowDuplicates = true;

        public const string UserIdClaimKey = "UserId";
    }
}
