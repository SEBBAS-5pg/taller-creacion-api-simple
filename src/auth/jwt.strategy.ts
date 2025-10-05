import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private UsersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'TU_SECRETO_SEGURO',
    });
  }
  async validate(payload: { sub: string; email: string }) {
    const user = await this.UsersService.findOneById(payload.sub);

    if(!user){
        throw new UnauthorizedException();
    }

    const {password, ...result} = user;
    return user;
  }
}
