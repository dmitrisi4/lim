import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) {}

	async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 10);
	}

	async comparePassword(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash);
	}

	async registerLocal(data: { email: string; name: string; password?: string }) {
		const existingUser = await this.prisma.user.findUnique({
			where: { email: data.email },
		});

		if (existingUser) {
			throw new ConflictException('User with this email already exists');
		}

		const hashedPassword = data.password ? await this.hashPassword(data.password) : undefined;

		return this.prisma.user.create({
			data: {
				email: data.email,
				name: data.name,
				password: hashedPassword,
			} as any, // Temporary cast until Prisma Client is regenerated
		});
	}

	async validateLocalUser(email: string, pass: string): Promise<any> {
		const user = await this.prisma.user.findUnique({ where: { email } });
		
		if (!user || !(user as any).password) {
			throw new UnauthorizedException('Invalid credentials');
		}

		if (!(user as any).password) {
			throw new UnauthorizedException('Please log in with Google to access this account');
		}

		if (await this.comparePassword(pass, (user as any).password)) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...result } = user as any;
			return result;
		}
		
		throw new UnauthorizedException('Invalid credentials');
	}

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
			// Link account if user registered with email before
			user = await this.prisma.user.update({
				where: { email: profile.email },
				data: { 
					googleId: profile.googleId, 
					avatarUrl: user.avatarUrl || profile.avatarUrl 
				},
			});
		}

		return user;
	}

	generateJwt(user: any) {
		const payload = { email: user.email, sub: user.id };
		return this.jwtService.sign(payload);
	}
}
