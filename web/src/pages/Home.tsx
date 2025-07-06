import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextInput";
import { DownloadIcon, LinkIcon } from "@phosphor-icons/react";
import Logo from "@/assets/Logo.svg";

export default function Home() {
  return (
    <div className="h-dvh flex justify-center mb-12">
      <div className="flex flex-col gap-5 w-full max-w-4xl px-4 items-stretch">
        <div className="mt-12 lg:mt-24 w-full flex justify-center lg:justify-start">
          <img src={Logo} alt="Brev" className="w-24 h-6" />
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          <div className="flex flex-col p-8 gap-4 bg-gray-100 w-11/12 lg:w-2/5">
            <p className="typography-lg text-gray-600">Novo link</p>
            <TextField id="linkOriginal" name="linkOriginal" label="Link Original" placeholder="www.exemplo.com" />
            <TextField id="linkEncurtado" name="linkEncurtado" label="Link Encurtado" placeholder="brev.ly/" />
            <Button>
              Salvar link
            </Button>
          </div>

          <div className="flex flex-col bg-gray-100 p-8 gap-4 w-11/12 lg:w-3/5">
            <div className="flex justify-between items-center gap-4">
              <p className="typography-lg text-gray-600">Meus links</p>
              <Button className="h-8" icon={<DownloadIcon size={16} className="text-gray-600" />} secondary>Baixar CSV</Button>
            </div>

            <div className="h-px w-full bg-gray-200" />

            <div className="flex flex-col items-center justify-center gap-2">
              <LinkIcon size={32} className="text-gray-400" />
              <p className="typography-xs text-gray-500">Ainda não existem links cadastrados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}