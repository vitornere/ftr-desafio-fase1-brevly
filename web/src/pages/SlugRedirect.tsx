import { useParams } from "wouter";
import LogoIcon from "@/assets/Logo_Icon.svg";

export default function SlugRedirect() {
  const { slug } = useParams();

  return (
    <div className="h-dvh flex justify-center items-center">
      <div className="flex flex-col gap-4 items-center bg-gray-100 rounded-lg mx-4 p-8 lg:p-16 lg:mx-0 text-center">
        <img src={LogoIcon} alt="Brev" className="w-12 h-12" />
        <p className="typography-xl text-gray-600">Redirecionando...</p>
        <span className="typography-md text-gray-500">O link será aberto automaticamente em alguns instantes.</span>
        <span className="typography-md text-gray-500">Não foi redirecionado? <a className="typography-md text-blue">Acesse aqui</a></span>
      </div>
    </div>
  )
}