import bcrypt from 'bcryptjs';

export const hashPassword = async(pass: string) => {
   return await bcrypt.hash(pass, 10);
}
