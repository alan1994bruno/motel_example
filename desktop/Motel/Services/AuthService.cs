using System;
using System.Net.Http.Json;
using System.Threading.Tasks; // Importante para o Task
using Motel.Models; // Adicione isso para encontrar suas classes de dados

namespace Motel.Services
{
    // Mude para public para as páginas Blazor acessarem
    public class AuthService
    {
        private readonly HttpClient _httpClient;
        private const string TokenKey = "auth_token";

        public AuthService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> LoginAsync(string email, string password)
        {
            var loginData = new LoginRequest { Email = email, Password = password };

            try
            {
                // Faz o POST para o seu endpoint
                var response = await _httpClient.PostAsJsonAsync("/auth/login", loginData);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<LoginResponse>();

                    if (result != null)
                    {
                        // Salva o token de forma criptografada no Windows
                        await SecureStorage.Default.SetAsync(TokenKey, result.Token);
                        return true;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                // Dica: você pode dar um Console.WriteLine(ex.Message) aqui para debugar se der erro
                return false;
            }
        }

        public async Task Logout()
        {
            SecureStorage.Default.Remove(TokenKey);
        }

        // Dica Extra: Método para recuperar o token quando precisar fazer outras chamadas
        public async Task<string> GetTokenAsync()
        {
            return await SecureStorage.Default.GetAsync(TokenKey);
        }
    }
}