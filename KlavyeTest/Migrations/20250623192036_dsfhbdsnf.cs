using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KlavyeTest.Migrations
{
    /// <inheritdoc />
    public partial class dsfhbdsnf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Languages",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Code",
                table: "Languages");
        }
    }
}
