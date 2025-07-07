import { useQuery, type UndefinedInitialDataOptions } from "@tanstack/react-query"
import { getOriginalLinkBySlug } from "@/http/short-links"

export function useGetShortLinkBySlug(
    slug: string,
    options?: Omit<UndefinedInitialDataOptions<{ originalUrl: string }, Error, { originalUrl: string }, string[]>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: ['short-links', slug],
        queryFn: () => getOriginalLinkBySlug(slug),
        ...(options ?? {}),
    })
}