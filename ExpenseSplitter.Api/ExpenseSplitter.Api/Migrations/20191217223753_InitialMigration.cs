using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ExpenseSplitter.Api.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Trips",
                columns: table => new
                {
                    Uid = table.Column<string>(maxLength: 16, nullable: false),
                    Name = table.Column<string>(maxLength: 50, nullable: true),
                    Description = table.Column<string>(maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    DeletedAt = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trips", x => x.Uid);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Email = table.Column<string>(maxLength: 50, nullable: true),
                    Password = table.Column<string>(maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Expenses",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TripUid = table.Column<string>(nullable: true),
                    AdderId = table.Column<int>(nullable: true),
                    PayerId = table.Column<int>(nullable: true),
                    Name = table.Column<string>(maxLength: 50, nullable: true),
                    Type = table.Column<int>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: false),
                    PaidAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Expenses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Expenses_Users_AdderId",
                        column: x => x.AdderId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Expenses_Users_PayerId",
                        column: x => x.PayerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Expenses_Trips_TripUid",
                        column: x => x.TripUid,
                        principalTable: "Trips",
                        principalColumn: "Uid",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TripsUsers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TripUid = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: true),
                    Name = table.Column<string>(maxLength: 60, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripsUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripsUsers_Trips_TripUid",
                        column: x => x.TripUid,
                        principalTable: "Trips",
                        principalColumn: "Uid",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TripsUsers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ExpensesParts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ExpenseId = table.Column<int>(nullable: true),
                    Value = table.Column<decimal>(type: "decimal(12, 2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExpensesParts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExpensesParts_Expenses_ExpenseId",
                        column: x => x.ExpenseId,
                        principalTable: "Expenses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ExpensesPartsUsers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ExpenseId = table.Column<int>(nullable: true),
                    UserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExpensesPartsUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExpensesPartsUsers_Expenses_ExpenseId",
                        column: x => x.ExpenseId,
                        principalTable: "Expenses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExpensesPartsUsers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_AdderId",
                table: "Expenses",
                column: "AdderId");

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_PayerId",
                table: "Expenses",
                column: "PayerId");

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_TripUid",
                table: "Expenses",
                column: "TripUid");

            migrationBuilder.CreateIndex(
                name: "IX_ExpensesParts_ExpenseId",
                table: "ExpensesParts",
                column: "ExpenseId");

            migrationBuilder.CreateIndex(
                name: "IX_ExpensesPartsUsers_ExpenseId",
                table: "ExpensesPartsUsers",
                column: "ExpenseId");

            migrationBuilder.CreateIndex(
                name: "IX_ExpensesPartsUsers_UserId",
                table: "ExpensesPartsUsers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TripsUsers_TripUid",
                table: "TripsUsers",
                column: "TripUid");

            migrationBuilder.CreateIndex(
                name: "IX_TripsUsers_UserId",
                table: "TripsUsers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExpensesParts");

            migrationBuilder.DropTable(
                name: "ExpensesPartsUsers");

            migrationBuilder.DropTable(
                name: "TripsUsers");

            migrationBuilder.DropTable(
                name: "Expenses");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Trips");
        }
    }
}
