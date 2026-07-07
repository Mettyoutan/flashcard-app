import type { User as U } from 'src/users/schemas/user.schema';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends Omit<U, 'password'> {}
  }
}

export {};
