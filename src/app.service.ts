import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  LoginRequestDto,
  AccessResponseDto,
  LogoutRequestDto,
  LogoutResponseDto,
} from './app.dto';

type UUID = string;

@Injectable()
export class AppService {
  private collection: Record<UUID, 0 | 1> = {};
  private adminLogin: string = 'King';
  private adminPasswd: string = 'apple';

  getHello(): object {
    return { message: 'Hello World!' };
  }

  getExact(id: number): object {
    return { name: `User_${id}` };
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
    if (creds.login == this.adminLogin && creds.passwd == this.adminPasswd) {
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
}
