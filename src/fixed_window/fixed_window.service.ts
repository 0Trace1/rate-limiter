import { Injectable } from '@nestjs/common';
import { CreateFixedWindowDto } from './dto/create-fixed_window.dto.js';
import { UpdateFixedWindowDto } from './dto/update-fixed_window.dto.js';

@Injectable()
export class FixedWindowService {
  create(createFixedWindowDto: CreateFixedWindowDto) {
    return 'This action adds a new fixedWindow';
  }

  findAll() {
    return `This action returns all fixedWindow`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fixedWindow`;
  }

  update(id: number, updateFixedWindowDto: UpdateFixedWindowDto) {
    return `This action updates a #${id} fixedWindow`;
  }

  remove(id: number) {
    return `This action removes a #${id} fixedWindow`;
  }
}
