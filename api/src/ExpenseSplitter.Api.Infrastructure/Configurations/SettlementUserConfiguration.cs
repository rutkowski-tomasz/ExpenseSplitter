using System.Diagnostics.CodeAnalysis;
using ExpenseSplitter.Api.Domain.Participants;
using ExpenseSplitter.Api.Domain.Settlements;
using ExpenseSplitter.Api.Domain.SettlementUsers;
using ExpenseSplitter.Api.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExpenseSplitter.Api.Infrastructure.Configurations;

[ExcludeFromCodeCoverage]
public class SettlementUserConfiguration : IEntityTypeConfiguration<SettlementUser>
{
    public void Configure(EntityTypeBuilder<SettlementUser> builder)
    {
        builder.ToTable("settlement_users");

        builder.HasKey(settlementUser => settlementUser.Id);

        builder.Property(settlementUser => settlementUser.Id)
            .HasConversion(settlementUserId => settlementUserId.Value, value => new SettlementUserId(value));

        builder.Property(su => su.SettlementId)
            .HasConversion(id => id.Value, value => new SettlementId(value));

        builder.Property(su => su.UserId)
            .HasConversion(id => id.Value, value => new UserId(value));

        builder.Property(su => su.ParticipantId)
            .HasConversion(
                id => id == null ? (Guid?)null : id.Value,
                value => value == null ? null : new ParticipantId(value.Value)
            );

        builder
            .HasOne(su => su.Participant)
            .WithMany(p => p.SettlementUsers)
            .HasForeignKey(su => su.ParticipantId)
            .IsRequired(false);
    }
}
