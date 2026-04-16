import { Controller, Get, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	private setTokenCookie(res: Response, jwt: string) {
		res.cookie('token', jwt, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
	}

	@Post('register')
	async register(@Body() body: { email: string; name: string; password?: string }) {
		return this.authService.registerLocal(body);
	}

	@Post('login')
	async login(@Body() body: { email: string; password?: string }, @Res() res: Response) {
		if (!body.password) {
			return res.status(400).json({ message: 'Password is required' });
		}
		const user = await this.authService.validateLocalUser(body.email, body.password);
		const jwt = this.authService.generateJwt(user);
		this.setTokenCookie(res, jwt);
		return res.json(user);
	}

	@Post('logout')
	async logout(@Res() res: Response) {
		res.clearCookie('token');
		return res.status(200).send({ message: 'Logged out' });
	}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async googleAuth(@Req() req: Request) {
		// Initiates the Google OAuth2 login flow
	}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
		const jwt = this.authService.generateJwt(req.user);
		this.setTokenCookie(res, jwt);

		const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
		return res.redirect(frontendUrl);
	}

	@Get('me')
	@UseGuards(AuthGuard('jwt'))
	getProfile(@Req() req: Request) {
		return req.user;
	}
}
