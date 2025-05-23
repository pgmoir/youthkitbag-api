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
  create(@Body(ValidationPipe) createKitbagDto: CreateKitbagDto) {
    return this.kitbagsService.create(createKitbagDto);
  }

  @Get()
  @ApiOkResponse({
    type: [KitbagResponseDto],
    description: 'Kitbags found',
  })
  findAll() {
    return this.kitbagsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: KitbagResponseDto, description: 'Kitbag found' })
  @ApiNotFoundResponse({ description: 'Kitbag not found' })
  findOne(@Param('id') id: string) {
    return this.kitbagsService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateKitbagDto })
  @ApiOkResponse({ type: KitbagResponseDto, description: 'Kitbag updated' })
  @ApiNotFoundResponse({ description: 'Kitbag not found' })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateKitbagDto: UpdateKitbagDto,
  ) {
    return this.kitbagsService.update(id, updateKitbagDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeletedResponseDto, description: 'Kitbag deleted' })
  @ApiNotFoundResponse({ description: 'Kitbag not found' })
  remove(@Param('id') id: string) {
    return this.kitbagsService.remove(id);
  }
}
