import { compare, genSalt, hash } from 'bcryptjs';

const SALT_ROUNDS = 16;

export const createHash = async (value: string) => await hash(value, await genSalt(SALT_ROUNDS));

export const compareHashToValue = async (value: string, hashedValue: string) => await compare(value, hashedValue);
