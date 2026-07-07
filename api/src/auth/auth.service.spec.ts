import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from './token.service';
import bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

// describe('AuthService', () => {
//   let service: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [AuthService],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

describe('AuthService', () => {
  let service: AuthService;
  let db: { user: { findUnique: jest.Mock } }; // function db.user.findUnique bertipe jest.Mock

  // Gunakan before each untuk isi service dengan mock
  beforeEach(async () => {
    db = { user: { findUnique: jest.fn() } }; // Isi function db.user.findUnique dengan jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DatabaseService, useValue: db }, // Untuk dependency injection ke AuthService
        { provide: TokenService, useValue: {} }, // Value sengaja dibuat kosong atau emty object
      ],
    }).compile(); // Buat testing module yang bantu create providers

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be UnauthorizedException when password is wrong', async () => {
    // Buat mock function dulu untuk set behaviour
    db.user.findUnique.mockReturnValue({
      id: 'x',
      email: 'a@a.com',
      password: await bcrypt.hash('correct', 10),
    });
    // when(db.user.findUnique()).thenReturn(fakeUser) di Mockito

    // insert wrong password
    await expect(
      service.login({ email: 'a@a.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
