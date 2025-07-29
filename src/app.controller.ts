import { Controller, Get, Post, Body } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody } from '@nestjs/swagger';
import {
  LoginRequestDto,
  AccessResponseDto,
  LogoutRequestDto,
  LogoutResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  DeleteUserRequestDto,
  DeleteUserResponseDto,
} from './app.dto';
import { PassThrough } from 'stream';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealthcheck(): object {
    return this.appService.getHealthcheck();
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

  @Post('/register')
  @ApiBody({ type: RegisterRequestDto })
  registerUser(@Body() body: RegisterRequestDto): RegisterResponseDto {
    const registerResponse = this.appService.registerUser(body);
    if (!registerResponse.success) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Error registering',
          detail: registerResponse.msg,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return registerResponse;
  }

  @Post('/delete')
  @ApiBody({ type: DeleteUserRequestDto })
  deteleUser(@Body() body: DeleteUserRequestDto): DeleteUserResponseDto {
    const checkAccess = this.appService.checkAccess(body.session_identifier);
    if (!checkAccess.boolean) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Error deleting account',
          detail: 'Invalid session indentifier',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const deleteResponse = this.appService.deleteUser(body);
    return deleteResponse;
  }
}
