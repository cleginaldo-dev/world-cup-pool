import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Icon, VStack } from "native-base";

import { Button } from "../Components/Button";
import { Header } from "../Components/Header";

export function Pools() {
  const { navigate } = useNavigation();

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
    </VStack>
  );
}
