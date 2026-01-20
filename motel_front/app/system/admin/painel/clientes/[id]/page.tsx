"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  ArrowLeft,
  Save,
  User,
  Lock,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

import { AdminHeader } from "@/components/header/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { getUserClient, updateUserClient } from "@/actions/user";

// --- 1. SCHEMA (Fonte da Verdade) ---
const clientSchema = yup.object({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  cpf: yup.string().required("CPF é obrigatório").min(14, "CPF incompleto"),
  phone: yup.string().required("Telefone é obrigatório"),
  cep: yup.string().required("CEP é obrigatório"),

  // Transform: Se vier string vazia "", converte para undefined.
  // Isso permite que o .optional() funcione corretamente.
  password: yup
    .string()
    .transform((curr, orig) => (orig === "" ? undefined : curr))
    .optional()
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

// --- 2. TIPO INFERIDO AUTOMATICAMENTE ---
// Removemos a definição manual. Agora o TS pega a definição do próprio Yup.
// Isso garante compatibilidade 100% com o resolver.
type ClientFormValues = yup.InferType<typeof clientSchema>;

// --- 2. FUNÇÕES DE MÁSCARA (Helpers) ---
const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

const maskCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id; // Pega o ID da URL (ex: 43224234)
  const [loading, setLoading] = useState(true);

  const form = useForm<ClientFormValues>({
    resolver: yupResolver(clientSchema) as Resolver<ClientFormValues>,
    defaultValues: {
      email: "",
      cpf: "",
      phone: "",
      cep: "",
      password: "" as unknown as string | undefined, // Inicia vazio
    },
  });
  const setValue = form.setValue;

  const getClientById = async (uuid: string) => {
    const client = await getUserClient(uuid);
    setValue("email", client.email);
    setValue("cpf", client.profile.cpf);
    setValue("phone", client.profile.phone);
    setValue("cep", client.profile.cep ? client.profile.cep : "");
    setLoading(false);

    console.log("Client Data Fetched:", client);
    return client;
  };

  // --- 3. BUSCAR DADOS DO CLIENTE (Simulação) ---
  useEffect(() => {
    // Aqui você faria: await getClientById(clientId)
    console.log("Buscando dados do ID:", clientId);
    if (clientId) getClientById(clientId as string);
  }, [clientId, form]);

  // --- 4. SUBMISSÃO ---
  const onSubmit = async (data: ClientFormValues) => {
    // Prepara o objeto para envio
    const payload = {
      email: data.email,
      cpf: data.cpf,
      phone: data.phone,
      cep: data.cep,
      ...(data.password ? { password: data.password } : {}),
    };

    console.log("Enviando atualização:", payload);

    await updateUserClient(clientId as string, payload);
    alert("Cliente atualizado com sucesso!");
    router.push("/system/admin/painel/clientes");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando dados do cliente...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />

      <main className="flex-1 container mx-auto p-8 flex justify-center">
        <Card className="w-full max-w-4xl shadow-lg border-t-4 border-t-[#4c1d95]">
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              <Link href="/system/admin/painel/clientes">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4 text-gray-600" />
                </Button>
              </Link>
              <div>
                <CardTitle className="text-2xl font-bold text-[#4c1d95] uppercase">
                  Editar Cliente
                </CardTitle>
                <CardDescription>
                  Alterando dados do cadastro ID:{" "}
                  <span className="font-mono font-bold text-gray-600">
                    #{clientId}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* --- GRUPO 1: DADOS DE ACESSO --- */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <h3 className="text-sm font-bold text-[#4c1d95] uppercase mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Dados de Acesso
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-700">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel className="font-bold text-gray-700 flex items-center gap-2">
                            Nova Senha{" "}
                            <Lock className="w-3 h-3 text-gray-400" />
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Deixe em branco para manter a atual"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Preencha apenas se desejar alterar a senha do
                            cliente.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* --- GRUPO 2: DADOS PESSOAIS --- */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <h3 className="text-sm font-bold text-[#4c1d95] uppercase mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Dados Pessoais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* CPF */}
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-700">
                            CPF
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="000.000.000-00"
                              onChange={(e) =>
                                field.onChange(maskCPF(e.target.value))
                              }
                              maxLength={14}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* TELEFONE */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-700 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> Telefone
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="(00) 00000-0000"
                              onChange={(e) =>
                                field.onChange(maskPhone(e.target.value))
                              }
                              maxLength={15}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* CEP */}
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-700 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> CEP
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="00000-000"
                              onChange={(e) =>
                                field.onChange(maskCEP(e.target.value))
                              }
                              maxLength={9}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#4c1d95] hover:bg-[#3b1676] text-white font-bold uppercase py-6 px-8 min-w-[200px]"
                    disabled={form.formState.isSubmitting}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {form.formState.isSubmitting
                      ? "Salvando..."
                      : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
