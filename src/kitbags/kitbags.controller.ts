import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserId } from '../decorators/user.decorator';
import { DeletedResponseDto } from '../dto/deleted-response.dto';
import { CreateKitbagDto } from './dto/create-kitbag.dto';
import { KitbagResponseDto } from './dto/kitbag-response.dto';
import { UpdateKitbagDto } from './dto/update-kitbag.dto';
import { KitbagsService } from './kitbags.service';

@Controller('kitbags')
export class KitbagsController {
  constructor(private readonly kitbagsService: KitbagsService) {}

  @Post()
  @ApiBody({ type: CreateKitbagDto })
  @ApiCreatedResponse({
    type: KitbagResponseDto,
    description: 'Kitbag created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  create(
    @UserId() userId: string,
    @Body(ValidationPipe) createKitbagDto: CreateKitbagDto,
  ) {
    return this.kitbagsService.create(createKitbagDto, userId);
  }

  @Get()
  @ApiOkResponse({
    type: [KitbagResponseDto],
    description: 'Kitbags found',
  })
  findAll(@UserId() userId: string) {
    return this.kitbagsService.findAll(userId);
  }

  @Get(':id')
  @ApiOkResponse({ type: KitbagResponseDto, description: 'Kitbag found' })
  @ApiNotFoundResponse({ description: 'Kitbag not found' })
  findOne(@UserId() userId: string, @Param('id') id: string) {
    return this.kitbagsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateKitbagDto })
  @ApiOkResponse({ type: KitbagResponseDto, description: 'Kitbag updated' })
  @ApiNotFoundResponse({ description: 'Kitbag not found' })
  update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body(ValidationPipe) updateKitbagDto: UpdateKitbagDto,
  ) {
    return this.kitbagsService.update(id, updateKitbagDto, userId);
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeletedResponseDto, description: 'Kitbag deleted' })
  @ApiNotFoundResponse({ description: 'Kitbag not found' })
  remove(@UserId() userId: string, @Param('id') id: string) {
    return this.kitbagsService.remove(id, userId);
  }
}
