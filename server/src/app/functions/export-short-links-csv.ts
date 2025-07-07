import { PassThrough, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { stringify } from 'csv-stringify';
import { asc } from 'drizzle-orm';
import { env } from '@/env';
import { db, pg } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage';
import { type Either, makeRight } from '@/shared/either';

export async function exportShortLinksCsv(): Promise<
  Either<never, { exportUrl: string }>
> {
  const { sql, params } = db
    .select({
      originalUrl: schema.links.originalUrl,
      slug: schema.links.slug,
      clicks: schema.links.clicks,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .orderBy(asc(schema.links.createdAt))
    .toSQL();

  const cursor = pg.unsafe(sql, params as string[]).cursor(50);

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'original_url', header: 'Original URL' },
      { key: 'short_url', header: 'Short URL' },
      { key: 'clicks', header: 'Clicks' },
      { key: 'created_at', header: 'Created At' },
    ],
  });

  const uploadToStorageStream = new PassThrough();

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(rows, _, done) {
        for (const row of rows) {
          this.push({
            ...row,
            short_url: `${env.DEFAULT_SHORT_URL}/${row.slug}`,
            created_at: new Date(row.created_at).toISOString(),
          });
        }
        done();
      },
    }),
    csv,
    uploadToStorageStream,
  );

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'exports',
    fileName: `${new Date().toISOString()}-exports.csv`,
    contentStream: uploadToStorageStream,
  });

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline]);

  return makeRight({
    exportUrl: url,
  });
}
