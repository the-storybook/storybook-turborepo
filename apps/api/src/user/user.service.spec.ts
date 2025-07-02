import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { PasswordEncoderService } from '../password_encoder/password_encoder.service';
import { OtpService } from '../otp/otp.service';
import { MailerService } from '../mailer/mailer.service';

describe('UserService', () => {
  let service: UserService;

  const mockUserModel = {
    new: jest.fn(),
    constructor: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  };

  const mockPasswordEncoderService = {
    encodePassword: jest.fn(),
    comparePasswords: jest.fn(),
  };

  const mockOtpService = {
    generateAndStoreOtp: jest.fn(),
    validateOtp: jest.fn(),
    generateOtp: jest.fn(),
    invalidateOtp: jest.fn(),
  };

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
