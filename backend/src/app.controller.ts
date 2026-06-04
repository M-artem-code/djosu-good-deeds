import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('health')
@Controller()
export class AppController {
  @Public()
  @Get('health')
  @ApiOkResponse({
    description: 'Service health check',
    schema: { example: { status: 'ok' } },
  })
  health(): { status: string } {
    return { status: 'ok' };
  }
}
