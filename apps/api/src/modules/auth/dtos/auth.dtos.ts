import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignInDTO extends SignUpDTO {}

export class AuthPayload {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  id: number;
}
