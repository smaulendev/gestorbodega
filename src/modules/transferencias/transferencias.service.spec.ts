import { Test, TestingModule } from '@nestjs/testing';
import { TransferenciasService } from './transferencias.service';

describe('TransferenciasService', () => {
  let service: TransferenciasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferenciasService],
    }).compile();

    service = module.get<TransferenciasService>(TransferenciasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
