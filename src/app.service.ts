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
  AdminLoginRequestDto,
  AdminLoginResponseDto,
  ListUsersRequestDto,
  ListUserResponseDto,
} from './app.dto';

type UUID = string;

@Injectable()
export class AppService {
  private collection: Record<UUID, 0 | 1> = {};
  private users: Map<string, string> = new Map();
  private adminLogin: string = 'King';
  private adminPasswd: string = 'apple';
  private adminUnique: string = 'linux';
  private adminLoggedUuid: UUID | null;

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
    } else if (this.adminLoggedUuid == uuid) {
      this.adminLoggedUuid = null;
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

  loginAdmin(request: AdminLoginRequestDto): AdminLoginResponseDto {
    const login = request.login;
    const passwd = request.passwd;
    const unique = request.unique;
    if (
      this.adminLogin == login &&
      this.adminPasswd == passwd &&
      this.adminUnique == unique
    ) {
      const uuid = this.getUuidString();
      this.adminLoggedUuid = uuid;
      return { success: true, msg: 'Access granted', uuid: uuid };
    }
    return { success: false, msg: 'Invalid credentials', uuid: null };
  }

  listUsers(request: ListUsersRequestDto): ListUserResponseDto {
    const uuid = request.uuid;
    if (!(this.adminLoggedUuid == uuid)) {
      return { success: false, msg: 'Access denied', users: null };
    }
    return {
      success: true,
      msg: 'Success',
      users: Object.fromEntries(this.users),
    };
  }
}
