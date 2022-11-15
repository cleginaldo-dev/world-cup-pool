import { getName } from "country-list";
import { format } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";
import { Button, HStack, Text, useTheme, VStack } from "native-base";
import { X, Check } from "phosphor-react-native";

import { Team } from "./Team";

interface GuessProps {
  id: string;
  gameId: string;
  createdAt: string;
  participantId: string;
  firstTeamPoints: number;
  secondTeamPoints: number;
}

export interface GameProps {
  id: string;
  firstTeamCountryCode: string;
  secondTeamCountryCode: string;
  guess: null | GuessProps;
  date: string;
}

interface Props {
  data: GameProps;
  onGuessConfirm: () => void;
  setFirstTeamPoints: (value: string) => void;
  setSecondTeamPoints: (value: string) => void;
}

export function Game({
  data,
  setFirstTeamPoints,
  setSecondTeamPoints,
  onGuessConfirm,
}: Props) {
  const { colors, sizes } = useTheme();

  const date = format(
    new Date(data.date),
    "dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
    { locale: ptBr }
  );

  return (
    <VStack
      w="full"
      bgColor="gray.800"
      rounded="sm"
      alignItems="center"
      borderBottomWidth={3}
      borderBottomColor="yellow.500"
      mb={3}
      p={4}
    >
      <Text color="gray.100" fontFamily="heading" fontSize="sm">
        {getName(data.firstTeamCountryCode)} vs.{" "}
        {getName(data.secondTeamCountryCode)}
      </Text>

      {date && (
        <Text color="gray.200" fontSize="xs">
          {date}
        </Text>
      )}

      <HStack
        mt={4}
        w="full"
        justifyContent="space-between"
        alignItems="center"
      >
        <Team
          code={data.firstTeamCountryCode}
          position="right"
          onChangeText={setFirstTeamPoints}
        />

        <X color={colors.gray[300]} size={sizes[6]} />

        <Team
          code={data.secondTeamCountryCode}
          position="left"
          onChangeText={setSecondTeamPoints}
        />
      </HStack>

      {!data.guess && (
        <Button
          size="xs"
          w="full"
          mt={4}
          colorScheme="green"
          onPress={onGuessConfirm}
        >
          <HStack alignItems="center">
            <Text color="white" fontSize="xs" fontFamily="heading" mr={3}>
              CONFIRMAR PALPITE
            </Text>

            <Check color={colors.white} size={sizes[4]} />
          </HStack>
        </Button>
      )}
    </VStack>
  );
}
