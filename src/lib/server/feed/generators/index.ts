// Generator registry — one function per implemented feed type. Rotation walks
// the round-robin order and tries generators until one produces a draw; a
// generator returning null (nothing to draw) skips to the next type.

import type { FeedType, GeneratorResult } from '../types';
import { generateResurrection } from './resurrections';
import { generateTombola } from './tombola';
import { generatePulse } from './pulse';
import { generateFloor } from './floor';

export type FeedGenerator = () => Promise<GeneratorResult | null>;

export const GENERATORS: Partial<Record<FeedType, FeedGenerator>> = {
	resurrections: generateResurrection,
	tombola: generateTombola,
	pulse: generatePulse,
	floor: generateFloor
};
