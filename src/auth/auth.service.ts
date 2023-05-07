import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(pseudo: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByPseudo(pseudo);
    if (user === null) {
      throw new NotFoundException('Pseudo incorrect');
    }
    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Users) {
    const payload = { pseudo: user.pseudo, sub: user.id };

    const dataUser = await this.usersService.findOneComplete(user.id);

    return {
      statusCode: 201,
      message: 'Login Ok',
      data: { access_token: this.jwtService.sign(payload), user: dataUser },
    };
  }
}
