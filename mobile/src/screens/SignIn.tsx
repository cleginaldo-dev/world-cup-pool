import { Fontisto } from "@expo/vector-icons";
import { Center, Icon, Text } from "native-base";

import Logo from "../assets/logo.svg";
import { Button } from "../Components/Button";
import { useAuth } from "../hooks/useAuth";

export function SignIn() {
  const { signIn, isLoading } = useAuth();

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Logo width={212} height={40} />

      <Button
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
        title="ENTRAR COM GOOGLE"
        type="SECONDARY"
        mt={12}
        onPress={signIn}
        isLoading={isLoading}
        _loading={{ _spinner: { color: "white" } }}
      />

      <Text color={"white"} textAlign="center" mt={4}>
        Não utilizamos nenhuma informação além {"\n"} do seu email para criação
        de sua conta.
      </Text>
    </Center>
  );
}
