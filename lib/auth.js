import { hash } from 'bcryptjs';

export async function hashedPassword(password){
    const hashPassword = await hash(password, 12);
    return hashPassword;
}