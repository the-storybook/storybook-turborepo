import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '@nestjs/swagger';

import { UUID } from 'crypto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Email and password are required or email already exists.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Returns a list of users.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Limit and offset must be numbers.' })
  async findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return await this.userService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Returns a user by ID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: UUID) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(@Param('id') id: UUID, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  remove(@Param('id') id: UUID) {
    return this.userService.remove(id);
  }
}
