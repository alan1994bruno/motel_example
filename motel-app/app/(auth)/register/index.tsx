import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Controller } from "react-hook-form";
import { useRegisterController } from "@/app/(auth)/register/register.controller";

export default function RegisterScreen() {
  const {
    control,
    errors,
    handleCepChange,
    handleCpfChange,
    handlePhoneChange,
    handleSubmit,
    loading,
    onSubmit,
  } = useRegisterController();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Criar nova conta</Text>
        <Text style={styles.subtitle}>
          Preencha os dados abaixo para se cadastrar.
        </Text>

        {/* Input de Email */}
        <Label text="Email" />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Insira seu e-mail"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && <ErrorMessage text={errors.email.message} />}

        {/* Input de Senha */}
        <Label text="Senha" />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Insira sua senha"
              value={value}
              onChangeText={onChange}
              secureTextEntry
            />
          )}
        />
        {errors.password && <ErrorMessage text={errors.password.message} />}

        {/* Input de Confirmar Senha */}
        <Label text="Repita Senha" />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Insira sua senha para confirmar"
              value={value}
              onChangeText={onChange}
              secureTextEntry
            />
          )}
        />
        {errors.confirmPassword && (
          <ErrorMessage text={errors.confirmPassword.message} />
        )}

        {/* Input de CPF (Com Máscara) */}
        <Label text="CPF" />
        <Controller
          control={control}
          name="cpf"
          render={({ field: { value } }) => (
            <Input
              placeholder="Insira seu CPF"
              value={value}
              onChangeText={handleCpfChange}
              keyboardType="numeric"
              maxLength={14}
            />
          )}
        />
        {errors.cpf && <ErrorMessage text={errors.cpf.message} />}

        {/* Input de CEP (Com Máscara) */}
        <Label text="CEP" />
        <Controller
          control={control}
          name="cep"
          render={({ field: { value } }) => (
            <Input
              placeholder="Insira seu CEP"
              value={value}
              onChangeText={handleCepChange}
              keyboardType="numeric"
              maxLength={9}
            />
          )}
        />
        {errors.cep && <ErrorMessage text={errors.cep.message} />}

        {/* Input de Telefone (Com Máscara) */}
        <Label text="Telefone" />
        <Controller
          control={control}
          name="phone"
          render={({ field: { value } }) => (
            <Input
              placeholder="Insira seu telefone"
              value={value}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              maxLength={15}
            />
          )}
        />
        {errors.phone && <ErrorMessage text={errors.phone.message} />}

        {/* Botão de Cadastro */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>CRIAR CONTA</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- Componentes Auxiliares para Estilo ---
const Label = ({ text }: { text: string }) => (
  <Text style={styles.label}>{text}</Text>
);

const ErrorMessage = ({ text }: { text?: string }) => (
  <Text style={styles.errorText}>{text}</Text>
);

const Input = (props: React.ComponentProps<typeof TextInput>) => (
  <TextInput style={styles.input} placeholderTextColor="#999" {...props} />
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B0082", // Roxo escuro do print
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
  button: {
    backgroundColor: "#5A189A", // Roxo do print
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
