import { parseFileName } from '@react-hive/honey-utils';
import { Mesh, Object3D, Vector3 } from 'three';
import type { BufferGeometry } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';

import type { Nullable, Supported3dModelExtension } from '~/types';

type ModelLoader = (buffer: ArrayBuffer) => BufferGeometry;

export class ModelLoaderError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'ModelLoaderError';
  }
}

const ensureGeometryAttributes = (geometry: BufferGeometry) => {
  if (!geometry.attributes.position) {
    throw new Error('Geometry has no position attribute');
  }

  if (!geometry.attributes.normal) {
    geometry.computeVertexNormals();
  }

  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
};

const findLargestMesh = (root: Object3D): Nullable<Mesh> => {
  let largestMesh: Nullable<Mesh> = null;
  let bestCount = 0;

  root.traverse(child => {
    if (
      child instanceof Mesh &&
      child.geometry &&
      (child.geometry as BufferGeometry).attributes.position
    ) {
      const position = (child.geometry as BufferGeometry).attributes.position;

      if (position && position.count > bestCount) {
        bestCount = position.count;
        largestMesh = child;
      }
    }
  });

  return largestMesh;
};

const stlLoader: ModelLoader = buffer => {
  let geo = new STLLoader().parse(buffer) as BufferGeometry;
  if (geo.index) {
    geo = geo.toNonIndexed();
  }

  ensureGeometryAttributes(geo);

  return geo;
};

const objLoader: ModelLoader = buffer => {
  const text = new TextDecoder().decode(buffer);
  const obj = new OBJLoader().parse(text);
  const mesh = findLargestMesh(obj);

  if (!mesh || !mesh.geometry) {
    throw new Error('OBJ: no mesh found');
  }

  let geo = mesh.geometry as BufferGeometry;
  if (geo.index) {
    geo = geo.toNonIndexed();
  }

  ensureGeometryAttributes(geo);

  return geo;
};

const threeMfLoader: ModelLoader = buffer => {
  const loader = new ThreeMFLoader();
  const scene = loader.parse(buffer);

  scene.updateMatrixWorld(true);

  const mesh = findLargestMesh(scene);
  if (!mesh || !mesh.geometry) {
    throw new Error('3MF: no mesh found');
  }

  let geo = mesh.geometry.clone() as BufferGeometry;
  geo.applyMatrix4(mesh.matrixWorld);

  if (geo.index) {
    geo = geo.toNonIndexed();
  }

  ensureGeometryAttributes(geo);

  return geo;
};

const MODEL_LOADERS: Record<Supported3dModelExtension, ModelLoader> = {
  stl: stlLoader,
  obj: objLoader,
  '3mf': threeMfLoader,
};

export const load3dModel = async (file: File): Promise<BufferGeometry> => {
  const buffer = await file.arrayBuffer();
  const [, fileExt] = parseFileName(file.name);

  if (fileExt && fileExt in MODEL_LOADERS) {
    const modeLoader = MODEL_LOADERS[fileExt as Supported3dModelExtension];

    return modeLoader(buffer);
  }

  throw new ModelLoaderError(`Unsupported file extension: ${fileExt}`);
};

export const calculateSolidVolumeMm3 = (geometry: BufferGeometry): number => {
  const position = geometry.attributes.position;

  let volume = 0;

  for (let i = 0; i < position.count; i += 3) {
    const ax = position.getX(i),
      ay = position.getY(i),
      az = position.getZ(i);

    const bx = position.getX(i + 1),
      by = position.getY(i + 1),
      bz = position.getZ(i + 1);

    const cx = position.getX(i + 2),
      cy = position.getY(i + 2),
      cz = position.getZ(i + 2);

    volume += ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx);
  }

  return Math.abs(volume) / 6;
};

export const calculateSurfaceAreaMm2 = (geometry: BufferGeometry): number => {
  const position = geometry.attributes.position;

  let area = 0;

  for (let i = 0; i < position.count; i += 3) {
    const ax = new Vector3(position.getX(i), position.getY(i), position.getZ(i));
    const bx = new Vector3(position.getX(i + 1), position.getY(i + 1), position.getZ(i + 1));
    const cx = new Vector3(position.getX(i + 2), position.getY(i + 2), position.getZ(i + 2));

    const ab = bx.clone().sub(ax);
    const ac = cx.clone().sub(ax);

    const cross = new Vector3().crossVectors(ab, ac);

    area += 0.5 * cross.length();
  }

  return area;
};
