import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "@/services/user";
import { useForm, Controller } from "react-hook-form";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "O email é obrigatório")
      .email("O formato do email é inválido"),

    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/,
        "A senha deve conter: maiúscula, minúscula, número e especial (@#$%^&+=)",
      ),

    confirmPassword: z.string().min(1, "Confirme sua senha"),

    cpf: z
      .string()
      .min(1, "O CPF é obrigatório")
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "O CPF deve ser 000.000.000-00"),

    cep: z
      .string()
      .min(1, "O CEP é obrigatório")
      .regex(/^\d{5}-\d{3}$/, "O CEP deve ser 00000-000"),

    phone: z
      .string()
      .min(1, "O telefone é obrigatório")
      .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido: (XX) XXXXX-XXXX"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Tipo inferido do Zod
type RegisterFormData = z.infer<typeof registerSchema>;

export const useRegisterController = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleCpfChange = (text: string) => {
    let value = text.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setValue("cpf", value, { shouldValidate: true });
  };

  const handleCepChange = (text: string) => {
    let value = text.replace(/\D/g, "");
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    setValue("cep", value, { shouldValidate: true });
  };

  const handlePhoneChange = (text: string) => {
    let value = text.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    setValue("phone", value, { shouldValidate: true });
  };

  // --- 3. Envio do Formulário ---
  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      // Removemos o confirmPassword antes de enviar para a API
      const { confirmPassword, ...apiData } = data;

      await createUser(apiData);

      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        { text: "OK", onPress: () => router.back() }, // Volta para login
      ]);
    } catch (error: any) {
      // Lógica de erro que discutimos antes
      if (error.response && error.response.data) {
        const serverErrors = error.response.data;
        const firstError = Object.values(serverErrors)[0];
        Alert.alert("Erro no cadastro", String(firstError));
      } else {
        Alert.alert("Erro", "Não foi possível criar a conta.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    onSubmit,
    handleCepChange,
    handleCpfChange,
    handlePhoneChange,
    handleSubmit,
    loading,
    control,
    errors,
  };
};
