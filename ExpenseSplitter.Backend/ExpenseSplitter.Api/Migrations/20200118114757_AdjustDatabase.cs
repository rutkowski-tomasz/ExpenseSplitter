using Microsoft.EntityFrameworkCore.Migrations;

namespace ExpenseSplitter.Api.Migrations
{
    public partial class AdjustDatabase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Nick",
                table: "Users",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(40) CHARACTER SET utf8mb4",
                oldMaxLength: 40,
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Nick",
                table: "Users",
                type: "varchar(40) CHARACTER SET utf8mb4",
                maxLength: 40,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 20,
                oldNullable: true);
        }
    }
}
