import { Octicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList, Icon, useToast, VStack } from "native-base";
import { useCallback, useState } from "react";

import { Button } from "../Components/Button";
import { EmptyPoolList } from "../Components/EmptyPoolList";
import { Header } from "../Components/Header";
import { Loading } from "../Components/Loading";
import { PoolCard, PoolCardPros } from "../Components/PoolCard";
import { api } from "../services/api";

export function Pools() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolCardPros[]>([]);
  const { navigate } = useNavigation();

  async function fetchPools() {
    try {
      setIsLoading(true);

      const { data } = await api.get("pools");

      setPools(data.pools);
    } catch (error) {
      toast.show({
        title: `Erro ao buscar os bolões`,
        bgColor: "red.500",
        placement: "top",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPools();
    }, [])
  );

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" showBackButton />

      <VStack
        mt={6}
        mx={5}
        pb={4}
        mb={4}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigate("find")}
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate("details", { id: item.id })}
            />
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 100 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}
    </VStack>
  );
}
