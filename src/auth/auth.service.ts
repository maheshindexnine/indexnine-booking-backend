import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service'; // adjust path
import { User } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(dto: {
    name: string;
    email: string;
    password: string;
    type: string;
  }) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await this.userService.create({
      ...dto,
      password: hashedPassword,
      type: dto.type as 'user' | 'admin' | 'vendor',
    });

    return this.generateToken(newUser);
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.password !== dto.password)
      throw new UnauthorizedException('Invalid credentials');

    // const isMatch = await bcrypt.compare(dto.password, user.password);
    // if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
    };
    return {
      access_token: this.jwtService.sign(payload),
      name: user.name,
      email: user.email,
      type: user.type,
      userId: user.id,
    };
  }
}
