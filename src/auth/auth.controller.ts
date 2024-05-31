import { Controller, Get, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyAccountDto } from './dto/verify.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PasswordResetDto } from './dto/password-reset.dto';
import { Response } from 'express';
import { Cookie } from '@app/shared/decorators/cookies.decorator';
import { AccessTokenResponse } from '@app/shared/dto/access.response';
import { MessageResponse } from '@app/shared/dto/message.response';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Вход через почту и пароль',
    description: 'Ставит http only куку и возвращает access token',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: AccessTokenResponse })
  @Post('login')
  login(@Body() dto: LoginDto, @Res() response: Response) {
    return this.authService.login(dto, response);
  }

  @ApiOperation({
    summary: 'Регистрация через почту и пароль',
    description: 'email должен быть уникальным',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: MessageResponse })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({
    summary: 'Подтверждение регистрации',
    description: 'Ставит http only куку и возвращает access token',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: AccessTokenResponse })
  @Post('verify-account')
  verifyAccount(@Body() dto: VerifyAccountDto, @Res() response: Response) {
    return this.authService.verifyAccount(dto, response);
  }

  @ApiOperation({
    summary: 'Запрос на сброс пароля',
  })
  @ApiResponse({ status: HttpStatus.OK, type: MessageResponse })
  @Post('reset-password-request')
  passwordResetRequest(@Body() dto: PasswordResetRequestDto) {
    return this.authService.passwordResetRequest(dto);
  }

  @ApiOperation({
    summary: 'Сброс пароля',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: MessageResponse })
  @Post('reset-password')
  passwordReset(@Body() dto: PasswordResetDto) {
    return this.authService.passwordReset(dto);
  }

  @ApiOperation({
    summary: 'Рефрешь access token',
    description: 'В куках должен быть действующий refresh token',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: AccessTokenResponse })
  @Get('refresh')
  refresh(@Cookie('refresh_token') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @ApiOperation({
    summary: 'Выход из аккаунта',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: MessageResponse })
  @Get('logout')
  logout(
    @Res() response: Response,
    @Cookie('refresh_token') refreshToken: string,
  ) {
    return this.authService.logout(response, refreshToken);
  }
}
