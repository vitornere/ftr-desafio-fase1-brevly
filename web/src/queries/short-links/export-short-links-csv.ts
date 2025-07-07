import { useQuery, type UndefinedInitialDataOptions } from "@tanstack/react-query"
import { exportShortLinksCsv } from "@/http/short-links"

export function useExportShortLinksCsv(
    options?: Omit<UndefinedInitialDataOptions<{ exportUrl: string }, Error, { exportUrl: string }, string[]>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: ['short-links', 'export'],
        queryFn: () => exportShortLinksCsv(),
        ...(options ?? {}),
    })
}