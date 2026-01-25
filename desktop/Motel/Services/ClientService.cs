using System.Net.Http.Json;
using System.Text.Json;
using System.Net.Http.Headers;
using Motel.Models;

namespace Motel.Services
{
    public class ClientService
    {
        private readonly HttpClient _httpClient;
        private readonly JsonSerializerOptions _options;

        public ClientService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        }

        public async Task<PageResponse<ClientUser>> GetClientsPageAsync(int page)
        {
            try
            {
                // 1. Pega o Token
                var token = await SecureStorage.Default.GetAsync("auth_token");

                if (!string.IsNullOrEmpty(token))
                {
                    _httpClient.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);
                }

                // 2. Chama a API: /users/clients?page=X
                var response = await _httpClient.GetAsync($"/users/clients?page={page}");

                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadFromJsonAsync<PageResponse<ClientUser>>(_options);
                }

                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<PageResponse<ClientUser>> GetPenalizedClientsPageAsync(int page)
        {
            try
            {
                // 1. Pega o Token
                var token = await SecureStorage.Default.GetAsync("auth_token");
                if (!string.IsNullOrEmpty(token))
                {
                    _httpClient.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);
                }

                // 2. Chama a API específica de Penalizados
                var response = await _httpClient.GetAsync($"/users/penalized?page={page}");

                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadFromJsonAsync<PageResponse<ClientUser>>(_options);
                }

                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task RemovePenaltyAsync(string penaltyId)
        {
            try
            {
                var token = await SecureStorage.Default.GetAsync("auth_token");
                if (!string.IsNullOrEmpty(token))
                {
                    _httpClient.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);
                }

                // Bate no endpoint: api.delete(`/penalties/${id}`);
                await _httpClient.DeleteAsync($"/penalties/{penaltyId}");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Erro ao remover penalidade: {ex.Message}");
            }
        }

        // 1. Buscar Cliente por ID (GET /users/{uuid})
        public async Task<ClientUser> GetUserClientAsync(string uuid)
        {
            try
            {
                var token = await SecureStorage.Default.GetAsync("auth_token");
                if (!string.IsNullOrEmpty(token))
                {
                    _httpClient.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);
                }

                var response = await _httpClient.GetAsync($"/users/{uuid}");

                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadFromJsonAsync<ClientUser>(_options);
                }
                return null;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Erro ao buscar cliente: {ex.Message}");
                return null;
            }
        }

        // 2. Atualizar Cliente (PUT /users/{uuid})
        public async Task<bool> UpdateUserClientAsync(string uuid, UpdateUserClientData data)
        {
            try
            {
                var token = await SecureStorage.Default.GetAsync("auth_token");
                if (!string.IsNullOrEmpty(token))
                {
                    _httpClient.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);
                }

                // Envia os dados como JSON
                var response = await _httpClient.PutAsJsonAsync($"/users/{uuid}", data);

                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Erro ao atualizar cliente: {ex.Message}");
                return false;
            }
        }
    }


}