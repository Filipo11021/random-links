import { Hash } from "@adonisjs/hash";
import { Scrypt } from "@adonisjs/hash/drivers/scrypt";

const cost = 2 ** 17;
const blockSize = 8;

export const passwordHashing = new Hash(
  new Scrypt({
    cost,
    blockSize,
    parallelization: 1,
    maxMemory: 128 * cost * blockSize * 2,
    keyLength: 64,
    saltSize: 16,
  })
);
