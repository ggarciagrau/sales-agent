import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Guideline } from '@sales-agent/db-connector';

@Injectable()
export class GuidelineService {
  constructor(private readonly dbService: DbService) {}

  async getGlobals(): Promise<Guideline[]> {
    return this.dbService.client.guideline.findMany({
      where: { isGlobal: true },
    });
  }

  async getRelevant(embedding: number[], limit: number): Promise<Guideline[]> {
    const result = await this.dbService.client.$queryRawUnsafe(
      `
      SELECT *, embedding <-> $1 AS distance
      FROM guidelines
      WHERE is_global = false
      ORDER BY distance ASC
      LIMIT ${limit}
    `,
      embedding,
    );
    return result as Guideline[];
  }
}
