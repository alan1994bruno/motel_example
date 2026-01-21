import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  password: yup.string().required("A senha é obrigatória"),
});

export const registerSchema = yup.object({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("A senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não coincidem")
    .required("Confirme sua senha"),
  cpf: yup
    .string()
    .matches(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, "CPF inválido") // Aceita com ou sem pontuação
    .required("CPF é obrigatório"),
  cep: yup.string().required("CEP é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
