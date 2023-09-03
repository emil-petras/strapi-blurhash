export type Config = {
  regenerateOnUpdate: boolean;
};

const DEFAULT_CONFIG = {
  regenerateOnUpdate: false,
} as const satisfies Config;

export default {
  default: () => DEFAULT_CONFIG,
  validator: (config: any) => {
    if (typeof config.regenerateOnUpdate !== 'boolean') {
      throw new Error('regenerateOnUpdate has to be a boolean');
    }
  },
};
