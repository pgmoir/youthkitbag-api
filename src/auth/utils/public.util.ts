import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY =
  '3%!hPJ%eSSO1PEKBl3K*g%vY#UQ@fZiMGR7h@SScf6nCE!RggdQNrF88Nt3e';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
