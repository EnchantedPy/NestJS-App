import { Controller, Get, Post, Body } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody } from '@nestjs/swagger';
import {
  ExactRequestDto,
  LoginRequestDto,
  AccessResponseDto,
  LogoutRequestDto,
  LogoutResponseDto,
} from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return this.appService.getHello();
  }

  @Post('/user/exact')
  @ApiBody({ type: ExactRequestDto })
  getExact(@Body() body: ExactRequestDto): object {
    return this.appService.getExact(body.id);
  }

  @Post('/login')
  @ApiBody({ type: LoginRequestDto })
  loginUser(@Body() body: LoginRequestDto): AccessResponseDto {
    const checkCreds: boolean = this.appService.checkCreds(body);
    if (!checkCreds) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
          detail: 'Username or password is incorrect',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const uuid = this.appService.getUuidString();
    return this.appService.checkAccess(uuid);
  }

  @Post('/logout')
  @ApiBody({ type: LogoutRequestDto })
  logoutUser(@Body() body: LogoutRequestDto): LogoutResponseDto {
    const logoutResponse = this.appService.logoutUser(body);
    if (!logoutResponse.success) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid session identifier',
          detail: 'Provided session identifier is incorrect!',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return logoutResponse;
  }
}
