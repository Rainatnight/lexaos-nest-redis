import { randomString } from './random';

export const UNMISTAKABLE_CHARS_METEOR =
  '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';

export const createId = () => randomString(17, UNMISTAKABLE_CHARS_METEOR);
