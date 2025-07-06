import { Module } from '@nestjs/common';
import { DbModule } from './modules/db/db.module';
import { ChatModule } from './modules/chat/chat.module';
import { GuidelineModule } from './modules/guideline/guideline.module';
import { LlmIntegrationsModule } from './modules/llm-integrations/llm-integrations.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    ChatModule,
    GuidelineModule,
    LlmIntegrationsModule,
  ],
})
export class AppModule {}
