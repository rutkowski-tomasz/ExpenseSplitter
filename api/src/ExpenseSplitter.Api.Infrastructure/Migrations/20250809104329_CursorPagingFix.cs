using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpenseSplitter.Api.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CursorPagingFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_settlements_updatedatutc_id_desc",
                table: "settlements");

            migrationBuilder.CreateIndex(
                name: "IX_settlements_updatedatutc_id",
                table: "settlements",
                columns: new[] { "updated_on_utc", "id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_settlements_updatedatutc_id",
                table: "settlements");

            migrationBuilder.CreateIndex(
                name: "IX_settlements_updatedatutc_id_desc",
                table: "settlements",
                columns: new[] { "updated_on_utc", "id" },
                descending: new bool[0]);
        }
    }
}
