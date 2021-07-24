import { vec2, mat2d } from "gl-matrix";
import { createContext } from "preact";
import { Ref } from "preact/hooks";

/*
 * transforms: [
 *  {
 *    name: 'str',
 *    points: [{ point... }],
 *    children: [{ transform... }],
 *    $parent: transform
 *  }
 * ]
 */

export interface Point {
  name: string;
  coordinates: vec2;
  // eslint-disable-next-line no-use-before-define
  $transform: Transform;
}
export interface Transform {
  name: string;
  matrix: mat2d;
  $globalMatrix: mat2d;
  $children: Transform[];
  parent?: Transform;
  points: Point[];
}
export interface Path {
  name: string;
  elements: (Point | Path)[];
}
export interface EditorMemory {
  transforms: Transform[];
  paths: Path[];
}

export const buildEditorMemory = (): EditorMemory => ({
  transforms: [],
  paths: [],
  // name: "abc",
  // points: [vec2.create()],
});

// export const EditorContext = createContext<Ref<EditorMemory>>({ current: null });
