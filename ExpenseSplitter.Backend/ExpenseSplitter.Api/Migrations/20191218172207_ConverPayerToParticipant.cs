using Microsoft.EntityFrameworkCore.Migrations;

namespace ExpenseSplitter.Api.Migrations
{
    public partial class ConverPayerToParticipant : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenses_Users_PayerId",
                table: "Expenses");

            migrationBuilder.AddForeignKey(
                name: "FK_Expenses_TripsParticipants_PayerId",
                table: "Expenses",
                column: "PayerId",
                principalTable: "TripsParticipants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenses_TripsParticipants_PayerId",
                table: "Expenses");

            migrationBuilder.AddForeignKey(
                name: "FK_Expenses_Users_PayerId",
                table: "Expenses",
                column: "PayerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
