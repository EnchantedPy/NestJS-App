import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
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
  AdminLoginRequestDto,
  AdminLoginResponseDto,
  ListUsersRequestDto,
  ListUserResponseDto,
} from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealthcheck(): object {
    return this.appService.getHealthcheck();
  }

  @Post('/login/user')
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

  @Delete('/delete')
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

  @Post('/login/admin')
  @ApiBody({ type: AdminLoginRequestDto })
  loginAdmin(@Body() body: AdminLoginRequestDto): AdminLoginResponseDto {
    const loginResponse = this.appService.loginAdmin(body);
    if (!loginResponse.success) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Error loging in',
          detail: loginResponse.msg,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return loginResponse;
  }

  @Post('/list')
  @ApiBody({ type: ListUsersRequestDto })
  listUsers(@Body() body: ListUsersRequestDto): ListUserResponseDto {
    const listResponse = this.appService.listUsers(body);
    if (!listResponse.success) {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Error listing users',
          detail: listResponse.msg,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return listResponse;
  }
}
