namespace Motel.Models
{
    // Representa os dados do perfil (CPF, Telefone)
    public class UserProfile
    {
        public string Cpf { get; set; }
        public string Phone { get; set; }
        public string Cep { get; set; }
    }

    // Representa a penalidade (se houver)
    public class UserPenalty
    {
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; }

        // Adicione aqui também se for usar o ID do perfil futuramente
        public string PublicId { get; set; }
    }

    // Representa o Cliente Principal
    public class ClientUser
    {
        public string Username { get; set; }

        public string PublicId { get; set; }
        public string Email { get; set; }
        public bool Enabled { get; set; } // true = Ativo, false = Bloqueado

        // Objetos aninhados (podem vir nulos, então cuidado no HTML)
        public UserProfile Profile { get; set; }
        public UserPenalty Penalty { get; set; }
    }


  
    public class UpdateUserClientData
    {
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Cpf { get; set; }
        public string Cep { get; set; }
        public string Password { get; set; } // Opcional
    }
}