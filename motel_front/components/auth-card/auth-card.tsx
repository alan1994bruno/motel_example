"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createUser } from "@/actions/user";
import { loginUser } from "@/actions/login-user";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
// --- SCHEMAS DE VALIDAÇÃO (YUP) ---

const loginSchema = yup.object({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  password: yup.string().required("A senha é obrigatória"),
});

const registerSchema = yup.object({
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

type LoginFormData = yup.InferType<typeof loginSchema>;
type RegisterFormData = yup.InferType<typeof registerSchema>;

// --- COMPONENTES DOS FORMULÁRIOS ---

function LoginForm() {
  const form = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    console.log("Login Data:", data);
    const result = await loginUser(data);

    console.log("Login Result:", result);
    if (result.success && result.data) {
      useUserStore.getState().setEmail(result.data); // salva no store
      router.replace("/"); // redireciona para a página inicial
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Insira seu e-mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Insira sua senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] font-bold text-white uppercase mt-4"
        >
          Login
        </Button>
        <Separator className="my-4" />
        <Link
          href="/recuperar-senha"
          className="text-sm text-center text-gray-600 hover:underline w-full block"
        >
          Esqueci minha senha
        </Link>
      </form>
    </Form>
  );
}

function RegisterForm() {
  const form = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      cpf: "",
      phone: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Register Data:", data);
    console.log(await createUser(data));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Insira seu e-mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Insira sua senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repita Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Insira sua senha para confirmar"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input placeholder="Insira seu CPF" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input placeholder="Insira seu CEP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="Insira seu telefone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] font-bold text-white uppercase mt-4"
        >
          Criar Conta
        </Button>
      </form>
    </Form>
  );
}

// --- COMPONENTE PRINCIPAL (TABS) ---

export function AuthCard() {
  return (
    <div className="flex items-center justify-center py-12">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-white data-[state=active]:text-[#4c1d95] font-bold uppercase"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="data-[state=active]:bg-white data-[state=active]:text-[#4c1d95] font-bold uppercase"
          >
            Criar Conta
          </TabsTrigger>
        </TabsList>

        {/* ABA LOGIN */}
        <TabsContent value="login">
          <Card className="border-t-4 border-t-[#4c1d95] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#4c1d95]">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription>
                Acesse sua conta para continuar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA CRIAR CONTA */}
        <TabsContent value="register">
          <Card className="border-t-4 border-t-[#4c1d95] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#4c1d95]">Criar nova conta</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para se cadastrar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
