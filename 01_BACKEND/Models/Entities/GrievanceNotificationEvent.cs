using System.Threading.Channels;

namespace E_Governance_System.Models.Entities
{
    public class GrievanceNotificationEvent
    {
        public string UserId { get; set; }
        public int GrievanceId { get; set; }
        public string Message { get; set; }
        public string Type { get; set; }
    }
    public static class GrievanceNotificationQueue
    {
        // Unbounded channel allows for high volume of notifications without blocking the API
        public static Channel<GrievanceNotificationEvent> Channel =
            System.Threading.Channels.Channel.CreateUnbounded<GrievanceNotificationEvent>();
    }
}
