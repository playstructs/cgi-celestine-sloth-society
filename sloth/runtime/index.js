// The Celestine Sloth Society overlay's runtime, loaded ahead of structs-webapp's entry.
//
// __sloth.guild is the guild this page plays through, Celestine Sloth Society (guild.js),
// __sloth.recovery moves a recovered player of another guild into it
// (recovery.js), __sloth.pfp shows players' own pictures (pfp.js) and
// __sloth.sloths lets a player pick their sloth at sign-up and on their
// profile (sloths.js).
// sloth/patches.cjs points webapp's code at them.
// __sloth.account creates the account at sign-up without showing its recovery
// key, and offers Download Player in place of Log Out (account.js).
import {guild} from './guild.js';
import {recovery} from './recovery.js';
import * as pfp from './pfp.js';
import {sloths} from './sloths.js';
import {account} from './account.js';

globalThis.__sloth = Object.freeze({guild, recovery, pfp: Object.freeze({...pfp}), sloths, account});
