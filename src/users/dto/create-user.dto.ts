import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { IsEmail } from 'class-validator';
import { Match } from '../match.decorator';

export class CreateUserDto {
  @ApiProperty()
  @Length(4, 24)
  @IsString()
  pseudo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(8, 32)
  @Matches(
    /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?\/~_+-=|]).{8,32}$/,
    { message: 'Le password ne correspond pas aux prérequis.' },
  )
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Match('password')
  passwordConfirm: string;
}
