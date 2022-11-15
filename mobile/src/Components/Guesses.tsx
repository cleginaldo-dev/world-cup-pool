/* eslint-disable consistent-return */
import { FlatList, useToast } from "native-base";
import { useState, useEffect } from "react";

import { api } from "../services/api";
import { EmptyMyPoolList } from "./EmptyMyPoolList";
import { Game, GameProps } from "./Game";
import { Loading } from "./Loading";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  const [games, setGames] = useState<GameProps[]>([]);

  async function fetchGuess() {
    try {
      setIsLoading(true);

      const { data } = await api.get(`pools/${poolId}/games`);

      setGames(data.games);
    } catch (error) {
      toast.show({
        title: `Erro ao carregar os jogos`,
        bgColor: "red.500",
        placement: "top",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
      return toast.show({
        title: `Informe o placar corretamente!`,
        bgColor: "red.500",
        placement: "top",
      });
    }

    try {
      setIsLoading(true);
      await api.post(`pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: `Palpite enviado com sucesso!`,
        bgColor: "green.500",
        placement: "top",
      });

      fetchGuess();
    } catch (error) {
      toast.show({
        title: `Erro ao enviar palpites`,
        bgColor: "red.500",
        placement: "top",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGuess();
  }, [poolId]);

  if (isLoading) return <Loading />;

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 100 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
