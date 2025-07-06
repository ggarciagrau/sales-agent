import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaDB } from '@sales-agent/db-connector';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private _client: PrismaDB;

  get client() {
    if (!this._client) {
      throw new Error('Db client not initialized yet');
    }

    return this._client;
  }

  async onModuleInit() {
    this._client = new PrismaDB();
    await this._client.$connect();
  }

  async onModuleDestroy() {
    await this._client.$disconnect();
  }
}
