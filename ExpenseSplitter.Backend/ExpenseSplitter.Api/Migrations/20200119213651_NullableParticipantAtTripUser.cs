using Microsoft.EntityFrameworkCore.Migrations;

namespace ExpenseSplitter.Api.Migrations
{
    public partial class NullableParticipantAtTripUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TripsUsers_TripsParticipants_ParticipantId",
                table: "TripsUsers");

            migrationBuilder.AlterColumn<int>(
                name: "ParticipantId",
                table: "TripsUsers",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_TripsUsers_TripsParticipants_ParticipantId",
                table: "TripsUsers",
                column: "ParticipantId",
                principalTable: "TripsParticipants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TripsUsers_TripsParticipants_ParticipantId",
                table: "TripsUsers");

            migrationBuilder.AlterColumn<int>(
                name: "ParticipantId",
                table: "TripsUsers",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TripsUsers_TripsParticipants_ParticipantId",
                table: "TripsUsers",
                column: "ParticipantId",
                principalTable: "TripsParticipants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
