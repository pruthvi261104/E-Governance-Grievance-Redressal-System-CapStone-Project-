using E_Governance_System.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace E_Governance_System.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Grievance> Grievances { get; set; }
        public DbSet<GrievanceHistory> GrievanceHistories { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // USER
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.FullName).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(150);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.PasswordHash).IsRequired();

                entity.HasOne(u => u.Role)
                      .WithMany()
                      .HasForeignKey(u => u.RoleId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(u => u.Department)
                      .WithMany()
                      .HasForeignKey(u => u.DepartmentId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ROLE
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Name).IsRequired().HasMaxLength(50);
            });

            // DEPARTMENT
            modelBuilder.Entity<Department>(entity =>
            {
                entity.HasKey(d => d.Id);
                entity.Property(d => d.Name).IsRequired().HasMaxLength(100);
            });

            // CATEGORY
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
               

                entity.HasOne(c => c.Department)
                      .WithMany()
                      .HasForeignKey(c => c.DepartmentId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // GRIEVANCE
            modelBuilder.Entity<Grievance>(entity =>
            {
                entity.HasKey(g => g.Id);

                entity.Property(g => g.Title).IsRequired().HasMaxLength(150);
                entity.Property(g => g.Description).IsRequired();
                entity.Property(g => g.Status).IsRequired().HasMaxLength(30);
                entity.Property(g => g.CreatedAt).IsRequired();

                entity.HasOne(g => g.Citizen)
                      .WithMany()
                      .HasForeignKey(g => g.CitizenId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(g => g.Category)
                      .WithMany()
                      .HasForeignKey(g => g.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(g => g.Department)
                      .WithMany()
                      .HasForeignKey(g => g.DepartmentId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(g => g.AssignedTo)
                      .WithMany()
                      .HasForeignKey(g => g.AssignedToId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            //GRIEVANCE HISTORY 
            modelBuilder.Entity<GrievanceHistory>(entity =>
            {
                entity.HasKey(h => h.Id);

                entity.Property(h => h.Action)
                      .IsRequired()
                      .HasMaxLength(30);

                entity.Property(h => h.Remarks)
                      .HasMaxLength(500);

                entity.Property(h => h.ActionAt)
                      .IsRequired();

                entity.HasOne(h => h.Grievance)
                      .WithMany()
                      .HasForeignKey(h => h.GrievanceId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(h => h.PerformedBy)
                      .WithMany()
                      .HasForeignKey(h => h.PerformedById)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
