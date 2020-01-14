using Microsoft.EntityFrameworkCore.Migrations;

namespace ExpenseSplitter.Api.Migrations
{
    public partial class FixExpensePartModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExpensesPartsParticipants_Expenses_ExpenseId",
                table: "ExpensesPartsParticipants");

            migrationBuilder.DropForeignKey(
                name: "FK_TripsParticipants_ExpensesParts_ExpensePartId",
                table: "TripsParticipants");

            migrationBuilder.DropIndex(
                name: "IX_TripsParticipants_ExpensePartId",
                table: "TripsParticipants");

            migrationBuilder.DropIndex(
                name: "IX_ExpensesPartsParticipants_ExpenseId",
                table: "ExpensesPartsParticipants");

            migrationBuilder.DropColumn(
                name: "ExpensePartId",
                table: "TripsParticipants");

            migrationBuilder.DropColumn(
                name: "ExpenseId",
                table: "ExpensesPartsParticipants");

            migrationBuilder.AddColumn<int>(
                name: "ExpensePartId",
                table: "ExpensesPartsParticipants",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ExpensesPartsParticipants_ExpensePartId",
                table: "ExpensesPartsParticipants",
                column: "ExpensePartId");

            migrationBuilder.AddForeignKey(
                name: "FK_ExpensesPartsParticipants_ExpensesParts_ExpensePartId",
                table: "ExpensesPartsParticipants",
                column: "ExpensePartId",
                principalTable: "ExpensesParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExpensesPartsParticipants_ExpensesParts_ExpensePartId",
                table: "ExpensesPartsParticipants");

            migrationBuilder.DropIndex(
                name: "IX_ExpensesPartsParticipants_ExpensePartId",
                table: "ExpensesPartsParticipants");

            migrationBuilder.DropColumn(
                name: "ExpensePartId",
                table: "ExpensesPartsParticipants");

            migrationBuilder.AddColumn<int>(
                name: "ExpensePartId",
                table: "TripsParticipants",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ExpenseId",
                table: "ExpensesPartsParticipants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TripsParticipants_ExpensePartId",
                table: "TripsParticipants",
                column: "ExpensePartId");

            migrationBuilder.CreateIndex(
                name: "IX_ExpensesPartsParticipants_ExpenseId",
                table: "ExpensesPartsParticipants",
                column: "ExpenseId");

            migrationBuilder.AddForeignKey(
                name: "FK_ExpensesPartsParticipants_Expenses_ExpenseId",
                table: "ExpensesPartsParticipants",
                column: "ExpenseId",
                principalTable: "Expenses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TripsParticipants_ExpensesParts_ExpensePartId",
                table: "TripsParticipants",
                column: "ExpensePartId",
                principalTable: "ExpensesParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
