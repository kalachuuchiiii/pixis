import ms from 'ms';

type CooldownResult<T> =
  | {
      ok: false;
      nextAvailableAt: number;
      remainingMS: number;
    }
  | {
      result: T;
      ok: true;
      nextAvailableAt: number;
    };

export const withCooldown = <T>(
  cooldown: ms.StringValue,
  lastActivatedAt: number | null | undefined,
  callback: () => T,
): CooldownResult<T> => {
  const now = Date.now();
  const cooldownMS = ms(cooldown);
  //the time that has passed

  if (!lastActivatedAt) {
    const result = callback();
    return {
      result,
      ok: true,
      nextAvailableAt: now + cooldownMS,
    };
  }

  const elapsedTime = now - lastActivatedAt;

  if (elapsedTime < cooldownMS) {
    return {
      nextAvailableAt: lastActivatedAt + cooldownMS,
      ok: false,
      remainingMS: cooldownMS - elapsedTime,
    };
  }

  const result = callback();
  return {
    result,
    ok: true,
    nextAvailableAt: now + cooldownMS,
  };
};
