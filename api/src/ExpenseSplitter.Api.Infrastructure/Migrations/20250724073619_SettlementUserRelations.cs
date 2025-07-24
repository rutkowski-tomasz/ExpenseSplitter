using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpenseSplitter.Api.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SettlementUserRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_settlement_users_users_user_id",
                table: "settlement_users");

            migrationBuilder.DropIndex(
                name: "ix_settlement_users_user_id",
                table: "settlement_users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_settlement_users_user_id",
                table: "settlement_users",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_settlement_users_users_user_id",
                table: "settlement_users",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
