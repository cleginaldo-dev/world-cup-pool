import { useNavigation } from "@react-navigation/native";
import { Heading, useToast, VStack } from "native-base";
import { useState } from "react";

import { Button } from "../Components/Button";
import { Header } from "../Components/Header";
import { Input } from "../Components/Input";
import { api } from "../services/api";

export function Find() {
  const { navigate } = useNavigation();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  async function handleJoinPool() {
    try {
      if (!code.trim()) {
        toast.show({
          title: `Digite um código!`,
          bgColor: "red.500",
          placement: "top",
        });
      }
      setIsLoading(true);

      await api.post("/pools/join", { code });

      toast.show({
        title: `Você entrou no bolão com sucesso!`,
        bgColor: "green.500",
        placement: "top",
      });

      navigate("pools");

      setCode("");
    } catch (error) {
      setIsLoading(false);
      if (error.response?.data?.message === "Pool not found.") {
        toast.show({
          title: `Bolão não encontrado!`,
          bgColor: "orange.500",
          placement: "top",
        });
      }

      if (error.response?.data?.message === "You already joined this pool.") {
        toast.show({
          title: `Você já está participando desse bolão!`,
          bgColor: "orange.500",
          placement: "top",
        });
      }

      toast.show({
        title: `Erro ao buscar o bolão`,
        bgColor: "red.500",
        placement: "top",
      });
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mb={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Encontre um bolão através de {"\n"} seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          onChangeText={setCode}
        />

        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
