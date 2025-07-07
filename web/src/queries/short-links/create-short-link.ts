import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import { createShortLink } from "@/http/short-links"
import { type CreateShortLink } from "@/types/short-links"
import { invalidateShortLinks } from "./list-short-links"

export function useCreateShortLink(
    options?: Omit<UseMutationOptions<{ id: string }, Error, CreateShortLink, unknown>, 'mutationFn' | 'onSuccess'>
) {
    const mutation = useMutation({
        mutationFn: (data: CreateShortLink) => createShortLink(data),
        onSuccess: () => invalidateShortLinks(),
        ...(options ?? {}),
    })

    return {
        createShortLink: mutation.mutate,
        ...mutation,
    }
}