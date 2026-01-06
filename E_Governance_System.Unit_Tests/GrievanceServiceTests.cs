using Xunit;
using E_Governance_System.Services;
using E_Governance_System.Data;
using E_Governance_System.Models.Entities;
using E_Governance_System.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace E_Governance_System.Unit_Tests
{
    public class GrievanceServiceTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly GrievanceService _service;

        public GrievanceServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _service = new GrievanceService(_context);

            SeedDatabase();
        }

        private void SeedDatabase()
        {
            // Defensive seeding matches your DbSeeder logic but for unit tests
            if (!_context.Departments.Any(d => d.Id == 1))
            {
                _context.Departments.Add(new Department { Id = 1, Name = "Electricity" });
            }

            if (!_context.Categories.Any(c => c.Id == 1))
            {
                _context.Categories.Add(new Category { Id = 1, Name = "Power Cut", DepartmentId = 1 });
            }

            if (!_context.Users.Any(u => u.Id == 10))
            {
                _context.Users.Add(new User
                {
                    Id = 10,
                    FullName = "Rajesh Verma",
                    Email = "supervisor@example.com",
                    PasswordHash = "hashed_val",
                    IsActive = true
                });
            }

            if (!_context.Users.Any(u => u.Id == 1025))
            {
                _context.Users.Add(new User
                {
                    Id = 1025,
                    FullName = "Eleofficer",
                    Email = "Ele@123.com",
                    PasswordHash = "hashed_val",
                    IsActive = true,
                    DepartmentId = 1
                });
            }

            _context.SaveChanges();
        }

        [Fact]
        public void CreateGrievance_InitialStatus_ShouldBeSubmitted()
        {
            // Arrange
            var dto = new GrievanceCreateDto
            {
                Title = "No Power",
                Description = "Area B18",
                CategoryId = 1
            };

            // Act
            // We ignore the anonymous return object and check the actual database state
            var result = _service.CreateGrievance(dto, 1014);

            // Assert
            // Fetch the grievance from the context to verify it was saved correctly
            var savedGrievance = _context.Grievances.FirstOrDefault(g => g.Title == "No Power");

            Assert.NotNull(savedGrievance);
            Assert.Equal("Submitted", savedGrievance.Status);
        }

        [Fact]
        public void AssignOfficer_ValidInputs_ShouldUpdateStatusToAssigned()
        {
            // ✅ Added Title and Description to satisfy constraints
            var grievance = new Grievance
            {
                Id = 100,
                Title = "Test Title",
                Description = "Test Desc",
                Status = "Submitted",
                CitizenId = 1014,
                DepartmentId = 1
            };
            _context.Grievances.Add(grievance);
            _context.SaveChanges();

            _service.AssignOfficer(100, 1025, 10);

            var updated = _context.Grievances.Find(100);
            Assert.Equal("Assigned", updated.Status);
            Assert.Equal(1025, updated.AssignedToId);
        }

        [Fact]
        public void MarkInReview_ShouldUpdateStatusAndAddHistory()
        {
            var grievance = new Grievance
            {
                Id = 101,
                Title = "Test Title",
                Description = "Test Desc",
                Status = "Assigned",
                AssignedToId = 1025
            };
            _context.Grievances.Add(grievance);
            _context.SaveChanges();

            _service.MarkInReview(101, 1025, "Checking transformer");

            var updated = _context.Grievances.Find(101);
            Assert.Equal("InReview", updated.Status);
        }

        [Fact]
        public void ResolveGrievance_ShouldUpdateStatusAndSetDate()
        {
            var grievance = new Grievance
            {
                Id = 102,
                Title = "Test Title",
                Description = "Test Desc",
                Status = "InReview",
                AssignedToId = 1025
            };
            _context.Grievances.Add(grievance);
            _context.SaveChanges();

            _service.ResolveGrievance(102, "Fuse replaced", 1025);

            var updated = _context.Grievances.Find(102);
            Assert.Equal("Resolved", updated.Status);
            Assert.NotNull(updated.ResolvedAt);
        }

        [Fact]
        public void EscalateGrievance_ValidResolvedGrievance_ShouldMarkAsEscalated()
        {
            var grievance = new Grievance
            {
                Id = 103,
                Title = "Test Title",
                Description = "Test Desc",
                Status = "Resolved",
                CitizenId = 1014
            };
            _context.Grievances.Add(grievance);
            _context.SaveChanges();

            _service.EscalateGrievance(103, 1014);

            var updated = _context.Grievances.Find(103);
            Assert.Equal("Escalated", updated.Status);
            Assert.True(updated.IsEscalated);
        }

        [Fact]
        public void ReopenGrievance_ShouldResetEscalationFlag()
        {
            var grievance = new Grievance
            {
                Id = 105,
                Title = "Test Title",
                Description = "Test Desc",
                Status = "Resolved",
                IsEscalated = true,
                CitizenId = 1014
            };
            _context.Grievances.Add(grievance);
            _context.SaveChanges();

            _service.ReopenGrievance(105, 1014, "Problem recurring");

            var updated = _context.Grievances.Find(105);
            Assert.Equal("Reopened", updated.Status);
            Assert.False(updated.IsEscalated);
        }

        [Fact]
        public void CloseGrievance_BySupervisor_ShouldMarkAsClosed()
        {
            var grievance = new Grievance
            {
                Id = 106,
                Title = "Test Title",
                Description = "Test Desc",
                Status = "Resolved",
                CitizenId = 1014
            };
            _context.Grievances.Add(grievance);
            _context.SaveChanges();

            _service.CloseGrievance(106, 10, "Service confirmed");

            var updated = _context.Grievances.Find(106);
            Assert.Equal("Closed", updated.Status);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}