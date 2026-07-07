import { Test, TestingModule } from '@nestjs/testing';
import { DecksService } from './decks.service';
import { DatabaseService } from 'src/database/database.service';

describe('DecksService', () => {
  let service: DecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DecksService, { provide: DatabaseService, useValue: {} }],
    }).compile();

    service = module.get<DecksService>(DecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
