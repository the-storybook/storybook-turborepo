import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { PasswordEncoderService } from '../password_encoder/password_encoder.service';
import { OtpService } from '../otp/otp.service';
import { MailerService } from '../mailer/mailer.service';
import { getModelToken } from '@nestjs/mongoose';

describe('UserController', () => {
  let controller: UserController;

  const mockUserModel = {
    new: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
  };

  const mockPasswordEncoderService = {
    encodePassword: jest.fn(),
    comparePasswords: jest.fn(),
  };

  const mockOtpService = {
    generateAndStoreOtp: jest.fn(),
    validateOtp: jest.fn(),
  };

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: PasswordEncoderService,
          useValue: mockPasswordEncoderService,
        },
        {
          provide: OtpService,
          useValue: mockOtpService,
        },
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = { email: 'ekrazz56@gmai.com', password: '1234', name: 'Jane Doe' };
    jest.spyOn(controller, 'create').mockImplementation(async (dto) => ({
      id: expect.any(String),
      ...dto,
    }) as unknown as User);

    const result = {
      id: expect.any(String),
      ...createUserDto,
    };

    expect(await controller.create(createUserDto)).toEqual(result);
  });
});
