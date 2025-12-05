import { SUPPORTED_3D_MODEL_EXTENSIONS } from '~/configs';

export type Nullable<T> = T | null;

export type HTTPRequestMethod = 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE';

export type Supported3dModelExtension = (typeof SUPPORTED_3D_MODEL_EXTENSIONS)[number];
