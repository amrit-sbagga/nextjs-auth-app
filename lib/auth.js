import { hash, compare } from 'bcryptjs';

export async function hashedPassword(password){
    const hashPassword = await hash(password, 12);
    return hashPassword;
}

export async function verifyPassword(password, hashPassword){
    const isValid = await compare(password, hashPassword);
    return isValid;
}