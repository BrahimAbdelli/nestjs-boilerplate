import { HttpException } from '@nestjs/common/exceptions/http.exception';

export function throwError(errors, message, code = 400) {
  throw new HttpException(
    {
      message,
      errors
    },
    code
  );
}
