import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// TODO: data to be a type of the user object
export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const request = ctx.switchToHttp().getRequest();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const user = request.user;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return data ? user?.[data] : user;
});
