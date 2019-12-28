using Microsoft.EntityFrameworkCore.Migrations;

namespace ExpenseSplitter.Api.Migrations
{
    public partial class RenameNicknameToNick : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nickname",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "Nick",
                table: "Users",
                maxLength: 40,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nick",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "Nickname",
                table: "Users",
                type: "varchar(40) CHARACTER SET utf8mb4",
                maxLength: 40,
                nullable: true);
        }
    }
}
