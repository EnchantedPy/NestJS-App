import { ApiProperty } from '@nestjs/swagger';

type UUID = string;

export class LoginRequestDto {
  @ApiProperty({ example: 'guest' })
  login: string;

  @ApiProperty({ example: 'guest' })
  passwd: string;
}

export class AccessResponseDto {
  @ApiProperty()
  info: string;

  @ApiProperty()
  boolean: boolean;

  @ApiProperty()
  session_identifier: UUID | null;
}

export class LogoutRequestDto {
  @ApiProperty()
  session_identifier: UUID;
}

export class LogoutResponseDto {
  @ApiProperty()
  success: boolean | null;
}

export class RegisterRequestDto {
  @ApiProperty({ example: 'guest' })
  login: string;

  @ApiProperty({ example: 'guest' })
  passwd: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Successfully registered' })
  msg: string;
}

export class DeleteUserRequestDto {
  @ApiProperty()
  session_identifier: UUID;

  @ApiProperty()
  login: string;
}

export class DeleteUserResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  msg: string;
}

export class AdminLoginRequestDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  passwd: string;

  @ApiProperty()
  unique: string;
}

export class AdminLoginResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  msg: string;

  @ApiProperty()
  uuid: UUID | null;
}

export class ListUsersRequestDto {
  @ApiProperty()
  uuid: UUID;
}

export class ListUserResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  msg: string;

  @ApiProperty()
  users: object | null;
}
