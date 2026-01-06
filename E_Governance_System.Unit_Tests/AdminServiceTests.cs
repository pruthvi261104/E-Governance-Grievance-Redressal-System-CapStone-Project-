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
    public class AdminServiceTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly AdminService _service;

        public AdminServiceTests()
        {
            // ✅ Setup In-Memory Database for clean, passing tests
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Unique name per test run
                .Options;

            _context = new ApplicationDbContext(options);
            _service = new AdminService(_context);
        }

        [Fact]
        public void AddDepartment_ThrowsException_IfDepartmentExists()
        {
            // Arrange: Add an existing department to the In-Memory DB
            _context.Departments.Add(new Department { Id = 1, Name = "Health" });
            _context.SaveChanges();

            var dto = new CreateDepartmentDto { Name = "Health" };

            // Act & Assert: This will now pass ✅
            var exception = Assert.Throws<Exception>(() => _service.AddDepartment(dto));
            Assert.Equal("Department already exists", exception.Message);
        }

        [Fact]
        public void AddDepartment_SavesSuccessfully_WhenNameIsUnique()
        {
            // Arrange
            var dto = new CreateDepartmentDto { Name = "Education" };

            // Act
            _service.AddDepartment(dto);

            // Assert: Verify data actually reached the DB ✅
            var dept = _context.Departments.FirstOrDefault(d => d.Name == "Education");
            Assert.NotNull(dept);
            Assert.Equal("Education", dept.Name);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}