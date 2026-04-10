import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) {}

	async validateOAuthUser(profile: {
		email: string;
		name: string;
		avatarUrl?: string;
		googleId: string;
	}) {
		let user = await this.prisma.user.findUnique({
			where: { email: profile.email },
		});

		if (!user) {
			user = await this.prisma.user.create({
				data: {
					email: profile.email,
					name: profile.name,
					avatarUrl: profile.avatarUrl,
					googleId: profile.googleId,
				},
			});
		} else if (!user.googleId) {
			user = await this.prisma.user.update({
				where: { email: profile.email },
				data: { googleId: profile.googleId, avatarUrl: profile.avatarUrl },
			});
		}

		return user;
	}

	generateJwt(user: any) {
		const payload = { email: user.email, sub: user.id };
		return this.jwtService.sign(payload);
	}
}
