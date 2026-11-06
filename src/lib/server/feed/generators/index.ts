// Generator registry — one function per implemented feed type. Rotation walks
// the round-robin order and tries generators until one produces a draw; a
// generator returning null (nothing to draw) skips to the next type.

import type { FeedType, GeneratorResult } from '../types';
import { generateResurrection } from './resurrections';
import { generateTombola } from './tombola';
import { generatePulse } from './pulse';
import { generateFloor } from './floor';
import { generateWalk } from './walk';
import { generateOneSave } from './one-save';
import { generatePitch } from './pitch';
import { generateTwoFutures } from './two-futures';
import { generateImpressTheBoss } from './impress-the-boss';
import { generateAmbitionPath } from './ambition-path';

export type FeedGenerator = () => Promise<GeneratorResult | null>;

export const GENERATORS: Partial<Record<FeedType, FeedGenerator>> = {
	resurrections: generateResurrection,
	tombola: generateTombola,
	pulse: generatePulse,
	floor: generateFloor,
	walk: generateWalk,
	'one-save': generateOneSave,
	'target-user-pitch': generatePitch,
	'two-futures': generateTwoFutures,
	'impress-the-boss': generateImpressTheBoss,
	'ambition-path': generateAmbitionPath
};
