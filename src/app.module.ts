import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { TransactionController } from './transactions/transaction.controller';
import { TransactionService } from './transactions/transaction.service';
import { TemporalTestService } from './transactions/TemporalTest.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: { brokers: ['localhost:9092'] },
          consumer: { groupId: 'transaction-consumer' },
        },
      },
    ]),
  ],
  controllers: [AppController, TransactionController],
  providers: [AppService, TransactionService,
    // TemporalTestService
  ],

})
export class AppModule {}
