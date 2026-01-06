using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_Governance_System.Migrations
{
    /// <inheritdoc />
    public partial class FixGrievanceHistoryForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GrievanceHistories_Users_PerformedById",
                table: "GrievanceHistories");

            migrationBuilder.DropColumn(
                name: "PerformedByUserId",
                table: "GrievanceHistories");

            migrationBuilder.AddForeignKey(
                name: "FK_GrievanceHistories_Users_PerformedById",
                table: "GrievanceHistories",
                column: "PerformedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GrievanceHistories_Users_PerformedById",
                table: "GrievanceHistories");

            migrationBuilder.AddColumn<int>(
                name: "PerformedByUserId",
                table: "GrievanceHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_GrievanceHistories_Users_PerformedById",
                table: "GrievanceHistories",
                column: "PerformedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
