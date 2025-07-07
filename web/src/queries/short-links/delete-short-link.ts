import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import { deleteShortLink } from "@/http/short-links"
import { invalidateShortLinks } from "./list-short-links"

export function useDeleteShortLink(
    options?: Omit<UseMutationOptions<void, Error, string, unknown>, 'mutationFn' | 'onSuccess'>
) {
    const mutation = useMutation({
        mutationFn: (id: string) => deleteShortLink(id),
        onSuccess: () => invalidateShortLinks(),
        ...(options ?? {}),
    })

    return {
        deleteShortLink: mutation.mutate,
        ...mutation,
    }
}