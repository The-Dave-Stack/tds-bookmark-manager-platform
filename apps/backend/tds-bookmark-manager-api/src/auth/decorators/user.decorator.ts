import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// TODO: data to be a type of the user object
export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const user = request.user;

  return data ? user?.[data] : user;
});
