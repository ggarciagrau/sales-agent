import { PrismaClient } from '@prisma-clients/sales-agent'

export class PrismaDB extends PrismaClient {
    constructor() {
        super()
        this.$connect()
    }
}