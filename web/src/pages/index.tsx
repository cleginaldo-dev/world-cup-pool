/* eslint-disable no-alert */
import Image from "next/image";
import { FormEvent, useState } from "react";

import appPreviewImg from "../assets/app-cup-preview.png";
import iconCheckImg from "../assets/icon-check.svg";
import logoImg from "../assets/logo.svg";
import usersAvatarExempleImg from "../assets/users-avatar-exemple.png";
import { api } from "../server/api";

interface IHomeProps {
  poolsCount: number;
  guessesCount: number;
  usersCount: number;
}

export default function Home(props: IHomeProps) {
  const [namePool, setNamePool] = useState("");

  const handleCreatePool = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data: codePool } = await api.post("pools", {
        title: namePool,
      });

      await navigator.clipboard.writeText(codePool);
      alert(
        `Bolão criado com sucesso! O código #${codePool} do ${namePool} foi copiado para area de transferência!`
      );
      setNamePool("");
    } catch (error) {
      console.log(error);
      alert("Erro ao criar bolão!");
    }
  };

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="Bolão" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExempleImg} alt="Avatares" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={handleCreatePool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            value={namePool}
            onChange={(e) => setNamePool(e.target.value)}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={appPreviewImg} alt="Dois celulares" quality={100} />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolsCount, guessesCount, usersCount] = await Promise.all([
    api.get("pools/count"),
    api.get("guesses/count"),
    api.get("users/count"),
  ]);

  console.log(poolsCount.data);

  return {
    props: {
      poolsCount: poolsCount.data.count,
      guessesCount: guessesCount.data.count,
      usersCount: usersCount.data.count,
    },
  };
};
