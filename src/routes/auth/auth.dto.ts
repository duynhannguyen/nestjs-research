import { Exclude, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { successResDto } from 'shared.dto';

export class LoginBodyDTO {
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString()
  name: string;
  @IsString()
  confirmPassword: string;
}
export class RegisterResData {
  id: number;
  email: string;
  name: string;
  @Exclude()
  password: string;
  confirmPassword: string;
  createdAt: Date;
  updatedAt: Date;
  constructor(partial: Partial<RegisterResData>) {
    Object.assign(this, partial);
  }
}
export class RegisterResDTO extends successResDto {
  @Type(() => RegisterResData)
  declare data: RegisterResData;
  constructor(partial: Partial<RegisterResDTO>) {
    super(partial);
    Object.assign(this, partial);
  }
}
