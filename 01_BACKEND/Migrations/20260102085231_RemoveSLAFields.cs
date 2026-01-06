using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_Governance_System.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSLAFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SLADueDate",
                table: "Grievances");

            migrationBuilder.DropColumn(
                name: "SLAHours",
                table: "Categories");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "SLADueDate",
                table: "Grievances",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "SLAHours",
                table: "Categories",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
