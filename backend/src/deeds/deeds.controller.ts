import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';
import { DeedsService } from './deeds.service';
import { CreateDeedDto } from './dto/create-deed.dto';
import { DeedPublicDto } from './dto/deed-public.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';

@ApiTags('deeds')
@ApiBearerAuth()
@Controller('deeds')
export class DeedsController {
  constructor(private readonly deedsService: DeedsService) {}

  @Post()
  @ApiCreatedResponse({ type: DeedPublicDto })
  create(@CurrentUser() user: UserDocument, @Body() dto: CreateDeedDto) {
    return this.deedsService.create(user._id.toString(), dto);
  }

  @Get()
  @ApiOkResponse({ type: [DeedPublicDto] })
  findAll(@CurrentUser() user: UserDocument) {
    return this.deedsService.findAllByOwner(user._id.toString());
  }

  @Get(':id')
  @ApiOkResponse({ type: DeedPublicDto })
  @ApiNotFoundResponse()
  findOne(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.deedsService.findOneByOwnerOrThrow(user._id.toString(), id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: DeedPublicDto })
  @ApiNotFoundResponse()
  update(@CurrentUser() user: UserDocument, @Param('id') id: string, @Body() dto: UpdateDeedDto) {
    return this.deedsService.updateByOwner(user._id.toString(), id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  delete(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.deedsService.deleteByOwner(user._id.toString(), id);
  }
}
