import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: { findOne: jest.Mock };
  let credentialRepo: { save: jest.Mock };
  let datasource: { transaction: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(() => {
    userRepo = { findOne: jest.fn() };
    credentialRepo = { save: jest.fn() };
    datasource = { transaction: jest.fn() };
    jwtService = { signAsync: jest.fn() };

    service = new AuthService(
      userRepo as any,
      credentialRepo as any,
      datasource as any,
      jwtService as any,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findUserByUsername should query the user repository', async () => {
    const expectedUser = { id: 1, username: 'tester' };
    userRepo.findOne.mockResolvedValue(expectedUser);

    const result = await service.findUserByUsername('tester', {
      select: { username: true },
    });

    expect(userRepo.findOne).toHaveBeenCalledWith({
      where: { username: 'tester' },
      select: { username: true },
    });
    expect(result).toBe(expectedUser);
  });

  it('signIn should return refresh token and payload', async () => {
    jwtService.signAsync.mockResolvedValue('refresh-token');
    const payload = { id: 1, username: 'tester' };

    const result = await service.signIn(payload as any);

    expect(jwtService.signAsync).toHaveBeenCalledWith(
      payload,
      expect.objectContaining({ secret: expect.any(String) }),
    );
    expect(result).toEqual({ refreshToken: 'refresh-token', payload });
  });

  it('refresh should return an access token', async () => {
    jwtService.signAsync.mockResolvedValue('access-token');
    const payload = { id: 1, username: 'tester' };

    const result = await service.refresh(payload as any);

    expect(jwtService.signAsync).toHaveBeenCalledWith(
      payload,
      expect.objectContaining({ secret: expect.any(String) }),
    );
    expect(result).toEqual({ accessToken: 'access-token' });
  });

  it('updatePassword should save a new hashed password when old password is correct', async () => {
    const credential = {
      comparePassword: jest.fn().mockResolvedValue(true),
      password: 'old-password',
    };
    const user = { id: 1, credential };
    userRepo.findOne.mockResolvedValue(user);
    credentialRepo.save.mockImplementation(async (value) => value);

    const result = await service.updatePassword(
      { id: 1, username: 'tester' } as any,
      {
        oldPassword: 'old-password',
        newPassword: 'new-password',
      },
    );

    expect(credential.comparePassword).toHaveBeenCalledWith('old-password');
    expect(credentialRepo.save).toHaveBeenCalledWith(credential);
    expect(result).toBe(credential);
    expect(result.password).not.toBe('old-password');
  });

  it('updatePassword should throw UnauthorizedException when the user is not found', async () => {
    userRepo.findOne.mockResolvedValue(null);

    await expect(
      service.updatePassword({ id: 1, username: 'tester' } as any, {
        oldPassword: 'old-password',
        newPassword: 'new-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('updatePassword should throw BadRequestException when the old password is incorrect', async () => {
    const credential = {
      comparePassword: jest.fn().mockResolvedValue(false),
      password: 'old-password',
    };
    const user = { id: 1, credential };
    userRepo.findOne.mockResolvedValue(user);

    await expect(
      service.updatePassword({ id: 1, username: 'tester' } as any, {
        oldPassword: 'wrong-password',
        newPassword: 'new-password',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
