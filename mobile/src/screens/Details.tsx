/* eslint-disable no-underscore-dangle */
import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useState, useEffect } from "react";
import { Share } from "react-native";

import { EmptyMyPoolList } from "../Components/EmptyMyPoolList";
import { Guesses } from "../Components/Guesses";
import { Header } from "../Components/Header";
import { Loading } from "../Components/Loading";
import { Option } from "../Components/Option";
import { PoolCardPros } from "../Components/PoolCard";
import { PoolHeader } from "../Components/PoolHeader";
import { api } from "../services/api";

interface routeParams {
  id: string;
}

export function Details() {
  const route = useRoute();

  const { id } = route.params as routeParams;

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const [pool, setPool] = useState<PoolCardPros>({} as PoolCardPros);

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);

      const { data } = await api.get(`pools/${id}`);

      setPool(data.pool);
    } catch (error) {
      toast.show({
        title: `Erro ao carregar detalhes do bolão`,
        bgColor: "red.500",
        placement: "top",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pool.code,
    });
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={pool.title}
        showBackButton
        showShareButton
        onShareCode={handleCodeShare}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack px={5} flex={1}>
          {pool._count.participants > 0 ? (
            <>
              <PoolHeader data={pool} />
              <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                <Option
                  title="Seus palpites"
                  isSelected={optionSelected === "guesses"}
                  onPress={() => setOptionSelected("guesses")}
                />
                <Option
                  title="Ranking do grupo"
                  isSelected={optionSelected === "ranking"}
                  onPress={() => setOptionSelected("ranking")}
                />
              </HStack>

              <Guesses code={pool.code} poolId={pool.id} />
            </>
          ) : (
            <EmptyMyPoolList code={pool.code} />
          )}
        </VStack>
      )}
    </VStack>
  );
}
