import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { env } from '@/env';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import * as uploadModule from '@/infra/storage/upload-file-to-storage';
import { isRight, unwrapEither } from '@/shared/either';
import { seedLinks } from '@/tests/utils/links-fixtures';
import { exportShortLinksCsv } from './export-short-links-csv';

describe('exportShortLinksCsv', () => {
  beforeEach(async () => {
    await db.delete(schema.links);
  });

  it('should export short links as csv', async () => {
    const uploadStub = vi
      .spyOn(uploadModule, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: `http://example.com/file.csv`,
        };
      });

    const links = await seedLinks(5);
    const sut = await exportShortLinksCsv();

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream;

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      generatedCSVStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      generatedCSVStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString());
      });
      generatedCSVStream.on('error', (err) => {
        reject(err);
      });
    });

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map((line) => line.split(','));

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual({
      exportUrl: 'http://example.com/file.csv',
    });

    expect(csvAsArray).toEqual([
      ['Original URL', 'Short URL', 'Clicks', 'Created At'],
      ...links.map((link) => [
        link.originalUrl,
        `${env.DEFAULT_SHORT_URL}/${link.slug}`,
        String(link.clicks),
        link.createdAt.toISOString(),
      ]),
    ]);
  });
});
