using System.Net.Http.Json;
using System.Text.Json;
using System.Net.Http.Headers; // Necessário para o cabeçalho de autorização
using Motel.Models;

namespace Motel.Services
{
    public class SuiteService
    {
        private readonly HttpClient _httpClient;
        private readonly JsonSerializerOptions _options;

        public SuiteService(HttpClient httpClient)
        {
            _httpClient = httpClient;

            // Configura para aceitar maiúsculas e minúsculas (hourlyRate -> HourlyRate)
            _options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
        }

        public async Task<PageResponse<RoomType>> GetRoomsPageAsync(int page)
        {
            try
            {
                // 1. RECUPERAR O TOKEN SALVO NO LOGIN
                var token = await SecureStorage.Default.GetAsync("auth_token");
                System.Diagnostics.Debug.WriteLine($"ERRO CRÍTICO: {token}");

                // 2. INSERIR O TOKEN NO CABEÇALHO DA REQUISIÇÃO (Bearer Token)
                if (!string.IsNullOrEmpty(token))
                {
                    _httpClient.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);
                }

                // 3. FAZER A CHAMADA
                var response = await _httpClient.GetAsync($"/rooms/page?page={page}");

                // Se o servidor negar (401), retornamos null sem travar
                if (!response.IsSuccessStatusCode)
                {
                    System.Diagnostics.Debug.WriteLine($"ERRO API: {response.StatusCode}");
                    return null;
                }

                // Lê o JSON usando as opções configuradas
                return await response.Content.ReadFromJsonAsync<PageResponse<RoomType>>(_options);
            }
            catch (Exception ex)
            {
                // Mostra o erro real no console do Visual Studio
                System.Diagnostics.Debug.WriteLine($"ERRO CRÍTICO: {ex.Message}");
                return null;
            }
        }
    }
}