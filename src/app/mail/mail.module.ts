import { Module } from '@nestjs/common';

import { MailTransporterService } from './mail-transporter.service';

@Module({
  imports: [],
  providers: [MailTransporterService],
  exports: [MailTransporterService],
})
export class MailModule {}
