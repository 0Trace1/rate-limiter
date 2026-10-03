import { PartialType } from '@nestjs/mapped-types';
import { CreateFixedWindowDto } from './create-fixed_window.dto.js';

export class UpdateFixedWindowDto extends PartialType(CreateFixedWindowDto) {}
