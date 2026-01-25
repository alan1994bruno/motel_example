namespace Motel.Models
{
    public class ReservationRoom
    {
        public string Name { get; set; }
        public decimal HourlyRate { get; set; }
        public int Units { get; set; }
        public List<RoomImage> Images { get; set; }
    }

    public class Reservation
    {
        public string PublicId { get; set; }
        public DateTime CheckinTime { get; set; }
        public DateTime CheckoutTime { get; set; }
        public decimal Price { get; set; }

        // Status Flags
        public bool Cancelled { get; set; }
        public DateTime? CancelledAt { get; set; } // Pode ser nulo
        public bool Completed { get; set; }
        public bool Occupied { get; set; }

        // Objetos Aninhados
        public ReservationRoom Room { get; set; }
        public ClientUser User { get; set; } // Reutilizando o model de Cliente
    }
}