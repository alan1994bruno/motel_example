"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";

import { AdminHeader } from "@/components/header/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createRoom } from "@/actions/rooms";

// --- 1. SCHEMA DE VALIDAÇÃO (YUP) ---
// AGORA TODAS AS URLs SÃO OBRIGATÓRIAS
const suiteSchema = yup.object({
  name: yup.string().required("O nome da suíte é obrigatório"),
  price: yup
    .number()
    .typeError("O preço deve ser um número")
    .positive("O preço deve ser positivo")
    .required("O preço é obrigatório"),
  units: yup
    .number()
    .typeError("O número de unidades deve ser um número")
    .positive("O número de unidades deve ser positivo")
    .required("O número de unidades é obrigatório"),
  url1: yup
    .string()
    .url("URL inválida")
    .required("A URL da 1ª imagem é obrigatória"),
  url2: yup
    .string()
    .url("URL inválida")
    .required("A URL da 2ª imagem é obrigatória"),
  url3: yup
    .string()
    .url("URL inválida")
    .required("A URL da 3ª imagem é obrigatória"),
});

type SuiteFormValues = yup.InferType<typeof suiteSchema>;

export default function NewSuitePage() {
  const router = useRouter();

  const form = useForm<SuiteFormValues>({
    resolver: yupResolver(suiteSchema),
    defaultValues: {
      name: "",
      price: undefined,
      units: 1,
      url1: "",
      url2: "",
      url3: "",
    },
  });

  const onSubmit = async (data: SuiteFormValues) => {
    console.log("Form Data Submitted:", data);
    await createRoom({
      name: data.name,
      hourlyRate: data.price,
      units: data.units,
      images: [data.url1, data.url2, data.url3],
    });
    alert("Suíte cadastrada com sucesso!");
    router.push("/system/admin/painel/suites");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />

      <main className="flex-1 container mx-auto p-8 flex justify-center">
        <Card className="w-full max-w-2xl shadow-lg border-t-4 border-t-[#4c1d95]">
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              <Link href="/system/admin/painel/suites">
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
                  Nova Suíte
                </CardTitle>
                <CardDescription>
                  Preencha todos os campos abaixo.
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
                {/* DADOS BÁSICOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-gray-700">
                          Nome da Suíte
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Suíte Master" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-gray-700">
                          Preço por Hora (R$)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="units"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-gray-700">
                          Unidades Disponíveis
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="1"
                            placeholder="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* IMAGENS (OBRIGATÓRIAS) */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Imagens da Suíte
                  </h3>

                  <FormField
                    control={form.control}
                    name="url1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          URL da Imagem 1{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="url2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          URL da Imagem 2{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="url3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          URL da Imagem 3{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-[#4c1d95] hover:bg-[#3b1676] text-white font-bold uppercase py-6 px-8"
                    disabled={form.formState.isSubmitting}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Suíte
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
