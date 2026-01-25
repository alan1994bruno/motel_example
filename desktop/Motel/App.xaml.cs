#if WINDOWS
using Microsoft.UI;
using Microsoft.UI.Windowing;
#endif

namespace Motel
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();
        }

        protected override Window CreateWindow(IActivationState? activationState)
        {
            var window = new Window(new MainPage()) { Title = "Motel" };

            const int larguraFixa = 1280;
            const int alturaFixa = 720;

            // Define tamanho inicial
            window.Width = larguraFixa;
            window.Height = alturaFixa;

            // Mantém suas travas de tamanho do MAUI
            window.MinimumWidth = larguraFixa;
            window.MaximumWidth = larguraFixa;
            window.MinimumHeight = alturaFixa;
            window.MaximumHeight = alturaFixa;

            // Posição inicial
            window.X = 100;
            window.Y = 100;

            // --- CÓDIGO NOVO PARA REMOVER O BOTÃO ---
            // Este evento dispara assim que a janela nativa do Windows é criada
            window.Created += (s, e) =>
            {
                #if WINDOWS
                // Pega a janela nativa do Windows
                var handle = WinRT.Interop.WindowNative.GetWindowHandle(window.Handler.PlatformView);
                var id = Win32Interop.GetWindowIdFromWindow(handle);
                var appWindow = AppWindow.GetFromWindowId(id);

                // Configura os botões da barra de título
                if (appWindow.Presenter is OverlappedPresenter presenter)
                {
                    presenter.IsMaximizable = false; // Desabilita o botão maximizar
                    presenter.IsResizable = false;   // Reforça que não pode mudar o tamanho
                }
                #endif
            };
            // ----------------------------------------

            return window;
        }
    }
}
