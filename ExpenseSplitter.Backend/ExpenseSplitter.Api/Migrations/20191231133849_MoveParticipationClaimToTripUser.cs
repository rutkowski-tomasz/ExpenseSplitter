using Microsoft.EntityFrameworkCore.Migrations;

namespace ExpenseSplitter.Api.Migrations
{
    public partial class MoveParticipationClaimToTripUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TripsParticipants_Users_UserId",
                table: "TripsParticipants");

            migrationBuilder.AddColumn<int>(
                name: "ParticipantId",
                table: "TripsUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "TripsParticipants",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_TripsUsers_ParticipantId",
                table: "TripsUsers",
                column: "ParticipantId");

            migrationBuilder.AddForeignKey(
                name: "FK_TripsParticipants_Users_UserId",
                table: "TripsParticipants",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TripsUsers_TripsParticipants_ParticipantId",
                table: "TripsUsers",
                column: "ParticipantId",
                principalTable: "TripsParticipants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TripsParticipants_Users_UserId",
                table: "TripsParticipants");

            migrationBuilder.DropForeignKey(
                name: "FK_TripsUsers_TripsParticipants_ParticipantId",
                table: "TripsUsers");

            migrationBuilder.DropIndex(
                name: "IX_TripsUsers_ParticipantId",
                table: "TripsUsers");

            migrationBuilder.DropColumn(
                name: "ParticipantId",
                table: "TripsUsers");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "TripsParticipants",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TripsParticipants_Users_UserId",
                table: "TripsParticipants",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
