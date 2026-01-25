using System.Net.Http.Json;
using System.Text.Json;
using System.Net.Http.Headers;
using Motel.Models;

namespace Motel.Services
{
    public class ReservationService
    {
        private readonly HttpClient _httpClient;
        private readonly JsonSerializerOptions _options;

        public ReservationService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        }

        // Método genérico privado para evitar repetição de código
        private async Task<PageResponse<Reservation>> GetReservationsByStatus(string status, int page)
        {
            try
            {
                var token = await SecureStorage.Default.GetAsync("auth_token");
                if (!string.IsNullOrEmpty(token))
                {
                    _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                }

                // Chama: /reservations/status/{status}?page={page}
                var response = await _httpClient.GetAsync($"/reservations/status/{status}?page={page}");

                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadFromJsonAsync<PageResponse<Reservation>>(_options);
                }
                return null;
            }
            catch
            {
                return null;
            }
        }

        // --- MÉTODOS PÚBLICOS PARA AS TELAS ---

        public async Task<PageResponse<Reservation>> GetActiveAsync(int page)
            => await GetReservationsByStatus("active", page);

        public async Task<PageResponse<Reservation>> GetCancelledAsync(int page)
            => await GetReservationsByStatus("cancelled", page);

        public async Task<PageResponse<Reservation>> GetCompletedAsync(int page)
            => await GetReservationsByStatus("completed", page);
    }
}