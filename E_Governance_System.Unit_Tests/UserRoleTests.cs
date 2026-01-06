using Xunit;
using E_Governance_System.Models.Entities; // Ensure this namespace matches your project

namespace E_Governance_System.Unit_Tests
{
    public class UserRoleTests
    {
        [Fact]
        public void NewUser_ShouldBeActiveByDefault()
        {
            // Arrange
            var user = new User();

            // Assert
            Assert.True(user.IsActive); // Validating output using assertions
        }
    }
}