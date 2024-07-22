import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardEntity } from './boards/entities/board.entity';
import { BoardsModule } from './boards/boards.module';
import { OrmConfig } from './config/TypeORM.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const ormConfig = new OrmConfig(configService);
        const config = await ormConfig.getOrmConfig();
        return {
          ...config,
          entities: [BoardEntity],
        };
      },
    }),
    BoardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
