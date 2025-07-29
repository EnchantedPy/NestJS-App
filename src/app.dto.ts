import { ApiProperty } from '@nestjs/swagger';

type UUID = string;

export class ExactRequestDto {
  @ApiProperty({ example: 1 })
  id: number;
}

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
