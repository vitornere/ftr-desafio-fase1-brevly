import { CopyIcon, TrashIcon } from "@phosphor-icons/react";
import Button from "./ui/Button";
import { useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

export default function Links() {
    const [links, setLinks] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    
    return (
        <ScrollArea.Root className="flex flex-col gap-4 max-h-[50vh] overflow-hidden">
            <ScrollArea.Viewport className="max-h-[50vh]">
                {links.map((link) => (
                    <div className="flex justify-between items-center py-4 border-t border-gray-200">
                        <div className="flex flex-col gap-2">
                            <a className="typography-md text-blue" href="brev.ly/1231231">brev.ly/1231231</a>
                            <span className="typography-sm text-gray-500">devsite.portflio.com.br/devname-12321</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="typography-sm text-gray-500">30 acessos</span>
                            <div className="flex gap-1">
                                <Button className="h-8" icon={<CopyIcon size={16} className="text-gray-600" />} secondary />
                                <Button className="h-8" icon={<TrashIcon size={16} className="text-gray-600" />} secondary />
                            </div>
                        </div>
                    </div>
                ))}
            </ScrollArea.Viewport>

            <ScrollArea.Scrollbar
                className="flex touch-none select-none bg-gray-200 p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
                orientation="vertical"
            >
                <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-gray-400 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    )
}