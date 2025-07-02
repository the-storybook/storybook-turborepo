import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UUID } from 'crypto';
import { PasswordEncoderService } from '../password_encoder/password_encoder.service';
import { OtpService } from '../otp/otp.service';
import { MailerService } from '../mailer/mailer.service';
import { ValidateOtpDto } from './dto/validate-otp.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private passwordEncoderService: PasswordEncoderService,
    private otpService: OtpService,
    private mailerService: MailerService
  ) {}

  async validateRegistrationEmailOTP(dto: ValidateOtpDto ): Promise<void> {
    const valid = await this.otpService.validateOtp(dto.email, 'register', dto.otp);
    if (!valid) {
      throw new BadRequestException('Invalid OTP');
    }

    const user = await this.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.verified = true;
    await user.save();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if(!createUserDto.email || !createUserDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    if(await this.findByEmail(createUserDto.email)) {
      throw new BadRequestException('Email already exists');
    }

    createUserDto.password = await this.passwordEncoderService.encodePassword(createUserDto.password);
    const user = new this.userModel(createUserDto);

    user.verified = false;
    user.version = 1;

    const otp = await this.otpService.generateAndStoreOtp(createUserDto.email, 'register');

    await this.mailerService.sendMail(createUserDto.email, 'Verify your email', `Your OTP is ${otp}. Please use this to verify your email.`);

    return await user.save()
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<User[]> {
    return await this.userModel.find().limit(limit).skip(offset).exec();
  }

  async findOne(id: UUID) {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async update(id: UUID, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if(!user) {
      throw new NotFoundException('User not found');
    }

    if(updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if(existingUser) {
        throw new BadRequestException('Email already exists');
      }

      user.email = updateUserDto.email;
    }

    if(updateUserDto.password) {
      user.password = await this.passwordEncoderService.encodePassword(updateUserDto.password);
    }

    user.name = updateUserDto.name || user.name;

    return await user.save();
  }

  async remove(id: UUID) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
