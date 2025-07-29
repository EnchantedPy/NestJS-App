import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
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

type UUID = string;

@Injectable()
export class AppService {
  private collection: Record<UUID, 0 | 1> = {};
  private users: Map<string, string> = new Map();

  getHealthcheck(): object {
    return { status: 'healthy' };
  }

  getUuidString(): UUID {
    const uuid = uuidv4();
    this.collection[uuid] = 1;
    return uuid;
  }

  checkAccess(uuid: UUID): AccessResponseDto {
    if (uuid in this.collection) {
      return {
        info: 'access granted',
        boolean: true,
        session_identifier: uuid,
      };
    } else {
      return {
        info: 'access denied',
        boolean: false,
        session_identifier: null,
      };
    }
  }

  checkCreds(creds: LoginRequestDto): boolean {
    if (
      this.users.has(creds.login) &&
      this.users.get(creds.login) == creds.passwd
    ) {
      return true;
    } else {
      return false;
    }
  }

  logoutUser(request: LogoutRequestDto): LogoutResponseDto {
    const uuid = request.session_identifier;
    if (!(uuid in this.collection) || this.collection[uuid] == 0) {
      return { success: false };
    }
    this.collection[uuid] = 0;
    return { success: true };
  }

  registerUser(request: RegisterRequestDto): RegisterResponseDto {
    if (this.users.has(request.login)) {
      return { success: false, msg: 'Username is already taken' };
    }
    this.users.set(request.login, request.passwd);
    return { success: true, msg: 'Successfully registered' };
  }

  deleteUser(request: DeleteUserRequestDto): DeleteUserResponseDto {
    const login = request.login;
    if (this.users.has(login)) {
      this.users.delete(login);
      this.collection[request.session_identifier] = 0;
      return { success: true, msg: 'User deleted' };
    }
    return { success: false, msg: 'Invalid login provided' };
  }
}
