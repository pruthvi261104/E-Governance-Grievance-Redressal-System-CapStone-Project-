using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using E_Governance_System.Controllers;
using E_Governance_System.Services.Interfaces;
using E_Governance_System.Models.DTOs;
using System;
using System.Reflection;

namespace E_Governance_System.Unit_Tests
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>();
            _controller = new AuthController(_mockAuthService.Object);
        }

        // ✅ Helper method to get properties from anonymous objects without using dynamic
        private object GetPropertyValue(object obj, string propertyName)
        {
            return obj.GetType().GetProperty(propertyName)?.GetValue(obj, null);
        }

        [Fact]
        public void Register_ReturnsOk_WhenSuccessful()
        {
            // Arrange
            var dto = new RegisterDto { FullName = "New User", Email = "new@egov.com", Password = "Password@123" };
            _mockAuthService.Setup(s => s.Register(dto));

            // Act
            var result = _controller.Register(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.True((bool)GetPropertyValue(okResult.Value, "success"));
            Assert.Equal("User registered successfully", GetPropertyValue(okResult.Value, "message"));
        }

        [Fact]
        public void Register_ReturnsBadRequest_WhenServiceThrowsException()
        {
            // Arrange
            var dto = new RegisterDto { Email = "duplicate@egov.com" };
            _mockAuthService.Setup(s => s.Register(dto))
                            .Throws(new Exception("Email already exists"));

            // Act
            var result = _controller.Register(dto);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.False((bool)GetPropertyValue(badRequest.Value, "success"));
            Assert.Equal("Email already exists", GetPropertyValue(badRequest.Value, "message"));
        }

        [Fact]
        public void Login_ReturnsOk_WithToken_WhenCredentialsAreValid()
        {
            // Arrange
            var dto = new LoginDto { Email = "admin@egov.com", Password = "Admin@123" };
            string mockToken = "mocked-jwt-token";
            _mockAuthService.Setup(s => s.Login(dto)).Returns(mockToken);

            // Act
            var result = _controller.Login(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.True((bool)GetPropertyValue(okResult.Value, "success"));
            Assert.Equal(mockToken, GetPropertyValue(okResult.Value, "token"));
            Assert.Equal("Login successful", GetPropertyValue(okResult.Value, "message"));
        }

        [Fact]
        public void Login_ReturnsBadRequest_WhenInvalidCredentialsProvided()
        {
            // Arrange
            var dto = new LoginDto { Email = "wrong@egov.com", Password = "WrongPassword" };
            _mockAuthService.Setup(s => s.Login(dto))
                            .Throws(new Exception("Invalid email or password"));

            // Act
            var result = _controller.Login(dto);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.False((bool)GetPropertyValue(badRequest.Value, "success"));
            Assert.Equal("Invalid email or password", GetPropertyValue(badRequest.Value, "message"));
        }
    }
}