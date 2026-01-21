"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  loginSchema,
  registerSchema,
} from "@/components/auth-card/auth-card.schemas";
import type {
  LoginFormData,
  RegisterFormData,
} from "@/components/auth-card/auth-card.schemas";

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

function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const setEmail = useUserStore((state) => state.setEmail);

  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { email } = await loginUser(data);
      if (email) {
        setEmail(email);
        router.replace("/");
      }
    } catch (error) {
      form.setError("root", { message: "Erro no login" });
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
  const form = useForm<RegisterFormData>({
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
    await createUser(data);
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
              <FormLabel>CEP</FormLabel>
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
      <Tabs defaultValue="login" className="w-100">
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
