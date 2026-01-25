using System.Text.Json.Serialization;

namespace Motel.Models
{
    // Representa cada imagem da suíte
    public class RoomImage
    {
        public string Url { get; set; }
        public string PublicId { get; set; }
    }

    // Representa a Suíte (RoomType)
    public class RoomType
    {
        public string Name { get; set; }
        public decimal HourlyRate { get; set; }
        public int Units { get; set; }
        public string PublicId { get; set; }
        public List<RoomImage> Images { get; set; }
    }

    // Representa a estrutura de paginação que a API devolve
    public class PageResponse<T>
    {
        public List<T> Content { get; set; }
        public int TotalElements { get; set; }
        public int TotalPages { get; set; }
        public int Number { get; set; } // Página atual
    }
}