using E_Governance_System.Data;
using E_Governance_System.Models;
using E_Governance_System.Models.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace E_Governance_System.Services
{
    public class NotificationBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public NotificationBackgroundService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // This reads from the static Channel Queue we created in Models
            await foreach (var evt in GrievanceNotificationQueue.Channel.Reader.ReadAllAsync(stoppingToken))
            {
                using var scope = _scopeFactory.CreateScope();
                // Replace ApplicationDbContext with your actual DB context name if different
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                var notification = new Notification
                {
                    UserId = evt.UserId,
                    GrievanceId = evt.GrievanceId,
                    Message = evt.Message,
                    Type = evt.Type,
                    CreatedOn = DateTime.Now,
                    IsRead = false
                };

                db.Notifications.Add(notification);
                await db.SaveChangesAsync(stoppingToken);
            }
        }
    }
}