import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextInput";
import { CopyIcon } from '@phosphor-icons/react'

export default function Home() {
  return <div className="p-10 max-w-2xs">
    <div className="flex flex-col gap-4">
      <Button>
        Test
      </Button>
      <Button disabled>
        Test
      </Button>
      <Button icon={<CopyIcon size={16} className="text-gray-600" />} secondary>
        Label
      </Button>
      <Button icon={<CopyIcon size={16} className="text-gray-600" />} secondary disabled>
        Label
      </Button>
      <Button icon={<CopyIcon size={16} className="text-gray-600" />} secondary />
      <Button icon={<CopyIcon size={16} className="text-gray-600" />} secondary disabled />
    </div>
    <div className="flex flex-col gap-4">
      <TextField label="Name" name="name" />
      <TextField label="Name" name="name" active />
      <TextField label="Name" name="name" error />
    </div>
  </div>
}