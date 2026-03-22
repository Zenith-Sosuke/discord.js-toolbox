/**
 * Custom error classes for Discord bot error handling
 */

class BotError extends Error {
  constructor(message, code = 'BOT_ERROR') {
    super(message);
    this.name = 'BotError';
    this.code = code;
  }
}

class PermissionError extends BotError {
  constructor(message = 'You do not have permission to use this command.') {
    super(message, 'PERMISSION_DENIED');
    this.name = 'PermissionError';
  }
}

class UserNotFoundError extends BotError {
  constructor(message = 'Could not find that user.') {
    super(message, 'USER_NOT_FOUND');
    this.name = 'UserNotFoundError';
  }
}

class InvalidArgumentError extends BotError {
  constructor(message = 'Invalid argument provided.') {
    super(message, 'INVALID_ARGUMENT');
    this.name = 'InvalidArgumentError';
  }
}

class CooldownError extends BotError {
  /**
   * @param {number} remaining - remaining cooldown in ms
   */
  constructor(remaining) {
    super(`You're on cooldown. Try again in ${(remaining / 1000).toFixed(1)}s.`, 'COOLDOWN');
    this.name = 'CooldownError';
    this.remaining = remaining;
  }
}

/**
 * A simple cooldown manager using a Map
 */
class CooldownManager {
  constructor() {
    this.cooldowns = new Map();
  }

  /**
   * Checks and applies a cooldown for a user on a specific command
   * @param {string} commandName
   * @param {string} userId
   * @param {number} durationMs
   * @returns {{ onCooldown: boolean, remaining: number }}
   */
  check(commandName, userId, durationMs) {
    const key = `${commandName}:${userId}`;
    const now = Date.now();
    const expiry = this.cooldowns.get(key);

    if (expiry && now < expiry) {
      return { onCooldown: true, remaining: expiry - now };
    }

    this.cooldowns.set(key, now + durationMs);
    return { onCooldown: false, remaining: 0 };
  }

  /**
   * Clears a user's cooldown for a command
   * @param {string} commandName
   * @param {string} userId
   */
  clear(commandName, userId) {
    this.cooldowns.delete(`${commandName}:${userId}`);
  }
}

class RateLimitError extends BotError {
  constructor(message = 'You are being rate limited.') {
    super(message, 'RATE_LIMITED');
    this.name = 'RateLimitError';
  }
}
module.exports = {
  BotError,
  PermissionError,
  UserNotFoundError,
  RateLimitError,
  InvalidArgumentError,
  CooldownError,
  CooldownManager,
};
