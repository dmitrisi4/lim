import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private prisma: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					let data = request?.cookies['token'];
					if (!data) {
						return null;
					}
					return data;
				},
			]),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET || 'supersecret',
		});
	}

	async validate(payload: { sub: string; email: string }) {
		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
		});
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
