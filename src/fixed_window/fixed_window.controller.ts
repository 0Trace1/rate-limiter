import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FixedWindowService } from './fixed_window.service.js';
import { CreateFixedWindowDto } from './dto/create-fixed_window.dto.js';
import { UpdateFixedWindowDto } from './dto/update-fixed_window.dto.js';

@Controller('fixed-window')
export class FixedWindowController {
  constructor(private readonly fixedWindowService: FixedWindowService) {}

  @Post()
  create(@Body() createFixedWindowDto: CreateFixedWindowDto) {
    return this.fixedWindowService.create(createFixedWindowDto);
  }

  @Get()
  findAll() {
    return this.fixedWindowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fixedWindowService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFixedWindowDto: UpdateFixedWindowDto) {
    return this.fixedWindowService.update(+id, updateFixedWindowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fixedWindowService.remove(+id);
  }
}
