// Caminho: theme/styled.d.ts
import "styled-components/native";
import theme from "../theme/index";

// Pega o tipo do seu objeto de tema
type ThemeType = typeof theme;

// Estende a interface DefaultTheme original da lib
declare module "styled-components/native" {
  export interface DefaultTheme extends ThemeType {}
}
