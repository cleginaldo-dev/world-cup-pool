/* eslint-disable consistent-return */
import { Heading, Text, useToast, VStack } from "native-base";
import { useState } from "react";

import Logo from "../assets/logo.svg";
import { Button } from "../Components/Button";
import { Header } from "../Components/Header";
import { Input } from "../Components/Input";
import { api } from "../services/api";

export function New() {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handlePoolCreate() {
    if (!title.trim()) {
      return toast.show({
        title: "Digite um nome para o bolão!",
        bgColor: "red.500",
        placement: "top",
      });
    }
    try {
      setIsLoading(true);

      await api.post("/pools", { title });

      toast.show({
        title: "Bolão criado com sucesso!",
        bgColor: "green.500",
        placement: "top",
      });

      setTitle("");
    } catch (error) {
      toast.show({
        title: `Erro ao criar o bolão: ${JSON.stringify(
          error.response?.data?.message
        )}`,
        bgColor: "red.500",
        placement: "top",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa {"\n"} e compartilhe entre amigos!
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o nome do seu bolão?"
          onChangeText={setTitle}
          value={title}
        />

        <Button
          title="Criar meu bolão"
          onPress={handlePoolCreate}
          isLoading={isLoading}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
