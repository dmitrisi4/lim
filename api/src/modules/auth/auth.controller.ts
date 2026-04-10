import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

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
		
		res.cookie('token', jwt, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000, 
		});

		const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
		return res.redirect(frontendUrl);
	}

	@Get('me')
	@UseGuards(AuthGuard('jwt'))
	getProfile(@Req() req: Request) {
		return req.user;
	}
}
