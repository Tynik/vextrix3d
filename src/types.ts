import type { HoneyColor } from '@react-hive/honey-style';

import { SUPPORTED_3D_MODEL_EXTENSIONS } from '~/configs';

export type Nullable<T> = T | null;

export type HTTPRequestMethod = 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE';

export type Supported3dModelExtension = (typeof SUPPORTED_3D_MODEL_EXTENSIONS)[number];

export interface NumericRange {
  min: number;
  max: number;
}

/**
 * Describes the colors styling applied to a specific entity type.
 *
 * Used to configure UI appearance (background and text colors)
 * for different record types throughout the application.
 *
 * @property text - Optional text (foreground) color token.
 * @property background - Optional background color token.
 */
export interface ColorsConfig {
  text?: HoneyColor;
  background?: HoneyColor;
}
