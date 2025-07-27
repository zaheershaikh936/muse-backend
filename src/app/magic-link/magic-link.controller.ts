import { Controller } from '@nestjs/common';
import { MagicLinkService } from './magic-link/magic-link.service';

@Controller('magic-link')
export class MagicLinkController {
  constructor(private readonly magicLinkService: MagicLinkService) {}
}
