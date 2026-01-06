using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using E_Governance_System.Controllers;
using E_Governance_System.Services.Interfaces;
using E_Governance_System.Models.DTOs;
using E_Governance_System.Models.Entities;
using E_Governance_System.Data;
using Microsoft.EntityFrameworkCore;
using System;

namespace E_Governance_System.Unit_Tests
{
    public class GrievancesControllerTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly Mock<IGrievanceService> _mockService;
        private readonly GrievancesController _controller;

        public GrievancesControllerTests()
        {
            // Use a unique database name per test instance to avoid interference
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);

            _mockService = new Mock<IGrievanceService>();
            _controller = new GrievancesController(_mockService.Object, _context);
        }

        private void MockUser(string userId, string role, string deptId = null)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Role, role)
            };

            if (deptId != null) claims.Add(new Claim("DepartmentId", deptId));

            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };
        }

        [Fact]
        public async Task CreateGrievance_ReturnsOk_AndTriggersNotification()
        {
            // Arrange
            MockUser("1014", "Citizen");
            var dto = new GrievanceCreateDto { Title = "No Water", Description = "Leakage", CategoryId = 1 };

            // Controller expects an object it can reflect upon for an 'Id' property
            _mockService.Setup(s => s.CreateGrievance(dto, 1014))
                        .Returns(new { Id = 500, Status = "Submitted" });

            // Act
            var result = await _controller.CreateGrievance(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
            _mockService.Verify(s => s.CreateGrievance(dto, 1014), Times.Once());
        }

        [Fact]
        public void DepartmentGrievances_ReturnsBadRequest_IfDeptClaimMissing()
        {
            // Arrange
            MockUser("1025", "DepartmentOfficer", deptId: null);

            // Act
            var result = _controller.DepartmentGrievances();

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("DepartmentId claim is missing.", badRequest.Value);
        }

        [Fact]
        public async Task AssignOfficer_CallsService_WithSupervisorId()
        {
            // Arrange
            MockUser("10", "SupervisoryOfficer");
            var dto = new AssignOfficerDto { OfficerUserId = 1025 };

            // Act
            var result = await _controller.AssignOfficer(1, dto);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            _mockService.Verify(s => s.AssignOfficer(1, 1025, 10), Times.Once());
        }

        [Fact]
        public async Task Resolve_TriggersNotification_ToCitizen()
        {
            // Arrange
            int grievanceId = 75;
            MockUser("1025", "DepartmentOfficer");

            // Must include required properties (Title, Description) to pass In-Memory validation
            _context.Grievances.Add(new Grievance
            {
                Id = grievanceId,
                CitizenId = 1014,
                Title = "Water Issue",
                Description = "Repair needed",
                Status = "InReview"
            });
            _context.SaveChanges();

            var dto = new GrievanceResolveDto { Remarks = "Fixed" };

            // Act
            var result = await _controller.Resolve(grievanceId, dto);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            _mockService.Verify(s => s.ResolveGrievance(grievanceId, "Fixed", 1025), Times.Once());
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}