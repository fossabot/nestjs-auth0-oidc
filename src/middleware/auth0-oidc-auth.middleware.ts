import { Inject, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Auth0AuthMiddlware } from 'src/types/auth0-oidc-types';
import { Auth0OpenIdConnectOptions } from 'src/interfaces/auth0-oidc-module-options.interface';

export class Auth0OidcAuthMiddleware implements NestMiddleware {
  public constructor(
    @Inject('AUTH_MIDDLEWARE') private readonly middleware: Auth0AuthMiddlware,
    @Inject('OPTIONS') private readonly options: Auth0OpenIdConnectOptions
  ) {}

  public use(req: Request, res: Response, next: () => void): any {
    this.middleware({
      ...this.options,
    })(req, res, next);
  }
}