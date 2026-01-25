using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration; // Necessário para ler o JSON
using System.Reflection; // Necessário para achar o arquivo no .exe
using Motel.Services;
using Motel.Models;

namespace Motel
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                });

            builder.Services.AddMauiBlazorWebView();

            // --- LÓGICA TIPO .ENV (AUTOMÁTICA) ---

            var a = Assembly.GetExecutingAssembly();

            // 1. Procura qualquer arquivo dentro do app que termine com "appsettings.json"
            // Isso evita o erro de errar o namespace (Motel. vs MotelDesktop.)
            var resourceName = a.GetManifestResourceNames()
                                .FirstOrDefault(x => x.EndsWith("appsettings.json"));

            var configBuilder = new ConfigurationBuilder();

            if (resourceName != null)
            {
                // Se achou, carrega as configurações
                using var stream = a.GetManifestResourceStream(resourceName);
                if (stream != null) configBuilder.AddJsonStream(stream);
            }

            var config = configBuilder.Build();
            builder.Configuration.AddConfiguration(config);

            // --------------------------------------

            builder.Services.AddScoped(sp =>
            {
                var client = new HttpClient();

                // 2. Tenta ler a URL do arquivo
                var url = config["ApiUrl"];

                // FALLBACK: Se o arquivo não existir ou estiver vazio, usa localhost para não travar
                if (string.IsNullOrEmpty(url))
                {
                    System.Diagnostics.Debug.WriteLine("AVISO: appsettings.json não encontrado ou vazio. Usando localhost.");
                    url = "http://localhost:8080";
                }

                client.BaseAddress = new Uri(url);
                client.Timeout = TimeSpan.FromSeconds(10);

                return client;
            });

            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<SuiteService>();
            builder.Services.AddScoped<ClientService>();
            builder.Services.AddScoped<ReservationService>();

#if DEBUG
            builder.Services.AddBlazorWebViewDeveloperTools();
#endif

            return builder.Build();
        }
    }
}