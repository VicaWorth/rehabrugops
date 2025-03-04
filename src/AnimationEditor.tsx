import {
  createSignal,
  type Component,
  For,
  onMount,
  createEffect,
  onCleanup,
} from "solid-js";
import { createStore } from "solid-js/store";
import { lerp } from "./utils";
import { Portal } from "solid-js/web";
import { setGameState } from "./App";

window["DEVMODE"] = true;

type Keyframe = {
  length: number;
} & CharacterState;

type CharacterState = {
  x: number;
  y: number;
  rot: number;
  scale: number;
  visible: boolean;
  zindex: number;
  flip: boolean;
  passive_animation: "talking" | "static";
};

const [activeKeyframeEditor, setActiveKeyframeEditor] = createSignal<
  { char: keyof typeof characters; id: number } | undefined
>(undefined);

const [time, setTime] = createSignal(0);
const [playing, setPlaying] = createSignal(true);

const BASE_KEYFRAME = {
  length: 0,

  x: 0,
  y: 0,
  rot: 0,
  scale: 1,
  visible: true,
  zindex: 0,
  flip: false,
  passive_animation: "talking",
} satisfies Keyframe;

const characterNames = [
  "rugops",
  "kat",
  "bankteller",
  "dinocity",
  "office",
  "bank",
  "meteor",
  "bankint",
] as const;
const [characters, setCharacters] = createStore({
  rugops: {
    keyframes: [
      {
        length: 5.64,
        x: -1,
        y: 0.37,
        rot: 30,
        scale: 1.87,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 0,
        x: 0.08,
        y: 0.47,
        rot: 30,
        scale: 0.5,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 5.73,
        x: -1,
        y: 0.37,
        rot: 30,
        scale: 2.44,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 0,
        x: 0.33,
        y: 0.39,
        rot: 30,
        scale: 2.44,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 2.99,
        x: -0.15,
        y: 0.21,
        rot: 30,
        scale: 3.03,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 0,
        x: 0.39,
        y: -0.6,
        rot: 360,
        scale: 2.98,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: -1,
        y: 0.31,
        rot: 28,
        scale: 1.59,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 0.78,
        x: -1,
        y: 0.24,
        rot: 28,
        scale: 1.47,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 2.9,
        x: -1,
        y: 0.27,
        rot: 35,
        scale: 1.33,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 0,
        x: -0.15,
        y: 0.32,
        rot: 35,
        scale: 0.67,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 3.7,
        x: -1,
        y: 0.22,
        rot: 35,
        scale: 1.78,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 0,
        x: 0.21,
        y: 0.55,
        rot: 35,
        scale: 1.38,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 5.91,
        x: -1,
        y: 0.3,
        rot: 33,
        scale: 2.25,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 0,
        x: -0.44,
        y: 0.32,
        rot: 24,
        scale: 1.63,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 4.49,
        x: -0.76,
        y: 0.28,
        rot: 35,
        scale: 1.38,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: -0.44,
        y: 0.44,
        rot: 35,
        scale: 1.73,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 2.81,
        x: -0.44,
        y: 0.44,
        rot: 35,
        scale: 1.73,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 0.87,
        x: -0.44,
        y: 0.44,
        rot: 35,
        scale: 1.73,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
      {
        length: 0.78,
        x: -0.44,
        y: 0.44,
        rot: 61,
        scale: 1.73,
        visible: true,
        zindex: 5,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 0.33,
        x: -0.44,
        y: 0.44,
        rot: 28,
        scale: 1.73,
        visible: true,
        zindex: 5,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 4.05,
        x: -0.44,
        y: 0.44,
        rot: 22,
        scale: 1.73,
        visible: true,
        zindex: 5,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 0,
        x: -0.44,
        y: 0.44,
        rot: 20,
        scale: 1.73,
        visible: true,
        zindex: 5,
        flip: true,
        passive_animation: "talking",
      },
    ] as Keyframe[],
  },
  bankteller: {
    keyframes: [
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 2.1,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 2,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 5.2,
        x: 0.32,
        y: 0.11,
        rot: 22,
        scale: 1.58,
        visible: true,
        zindex: 2,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0.43,
        y: 0.08,
        rot: 30,
        scale: 1.82,
        visible: true,
        zindex: 2,
        flip: false,
        passive_animation: "talking",
      },
    ] as Keyframe[],
  },
  kat: {
    keyframes: [
      {
        length: 7.68,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 0,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: true,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 3.7,
        x: 0.31,
        y: 0.08,
        rot: 0,
        scale: 1,
        visible: true,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: true,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: true,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 50,
        scale: 1,
        visible: true,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
    ] as Keyframe[],
  },
  dinocity: {
    keyframes: [
      {
        length: 5.64,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: true,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 2.81,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 0,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 0,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
    ] as Keyframe[],
  },
  office: {
    keyframes: [
      {
        length: 5.64,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 5.64,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: true,
        zindex: 2,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 5.64,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: true,
        zindex: 2,
        flip: false,
        passive_animation: "talking",
      },
    ] as Keyframe[],
  },
  bank: {
    keyframes: [
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 7.95,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 4.14,
        x: 0,
        y: 0,
        rot: 0,
        scale: 5.84,
        visible: true,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 0,
        x: 0,
        y: 0,
        rot: 0,
        scale: 6.04,
        visible: true,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 0,
        x: 0,
        y: 0,
        rot: 0,
        scale: 6.04,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
    ] as Keyframe[],
  },
  meteor: {
    keyframes: [
      {
        length: 1.4,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 3.17,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: true,
        zindex: 3,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 3.61,
        x: 0,
        y: 0,
        rot: 0,
        scale: 4,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
    ] as Keyframe[],
  },
  bankint: {
    keyframes: [
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 0,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 1.84,
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 3.25,
        x: 0,
        y: 0,
        rot: 0,
        scale: 3.93,
        visible: true,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 2.37,
        x: 0,
        y: 0,
        rot: 0,
        scale: 3.83,
        visible: true,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 10,
        x: 0,
        y: 0,
        rot: 0,
        scale: 3.83,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
      {
        length: 0,
        x: 0,
        y: 0,
        rot: 0,
        scale: 3.83,
        visible: false,
        zindex: 1,
        flip: false,
        passive_animation: "talking",
      },
    ] as Keyframe[],
  },
});

const KeyframeEditor: Component = () => {
  const inputStyles = "p-2 rounded-md border border-neutral-300";

  return (
    <div class="bg-white z-[10000] items-center rounded-lg border border-neutral-300 grid grid-cols-[min-content,1fr] w-72 p-2 fixed top-4 left-4 gap-2">
      <h1 class="text-lg font-bold col-span-2">
        {activeKeyframeEditor().char} Keyframe #{activeKeyframeEditor().id + 1}
      </h1>

      <label class="text-nowrap">length (s)</label>
      <div class="flex gap-2">
        <span class="font-mono">
          {characters[activeKeyframeEditor().char].keyframes[
            activeKeyframeEditor().id
          ].length.toFixed(2)}
        </span>
        <input
          onInput={(e) =>
            setCharacters(
              activeKeyframeEditor().char,
              "keyframes",
              activeKeyframeEditor().id,
              "length",
              +e.target.value,
            )
          }
          type="range"
          min={0}
          step={0.01}
          max={10}
          class="p-2 rounded border border-neutral-300"
          value={
            characters[activeKeyframeEditor().char].keyframes[
              activeKeyframeEditor().id
            ].length
          }
        />
      </div>

      <label>x</label>
      <input
        onInput={(e) =>
          setCharacters(
            activeKeyframeEditor().char,
            "keyframes",
            activeKeyframeEditor().id,
            "x",
            +e.target.value,
          )
        }
        type="range"
        value={
          characters[activeKeyframeEditor().char].keyframes[
            activeKeyframeEditor().id
          ].x
        }
        step={0.01}
        min={-1}
        max={1}
        class={inputStyles}
      />

      <label>y</label>
      <input
        onInput={(e) =>
          setCharacters(
            activeKeyframeEditor().char,
            "keyframes",
            activeKeyframeEditor().id,
            "y",
            +e.target.value,
          )
        }
        type="range"
        value={
          characters[activeKeyframeEditor().char].keyframes[
            activeKeyframeEditor().id
          ].y
        }
        step={0.01}
        min={-1}
        max={1}
        class={inputStyles}
      />

      <label>scale</label>
      <input
        onInput={(e) =>
          setCharacters(
            activeKeyframeEditor().char,
            "keyframes",
            activeKeyframeEditor().id,
            "scale",
            +e.target.value,
          )
        }
        type="range"
        value={
          characters[activeKeyframeEditor().char].keyframes[
            activeKeyframeEditor().id
          ].scale
        }
        step={0.01}
        min={0.1}
        max={8}
        class={inputStyles}
      />

      <label>rot</label>
      <input
        onInput={(e) =>
          setCharacters(
            activeKeyframeEditor().char,
            "keyframes",
            activeKeyframeEditor().id,
            "rot",
            +e.target.value,
          )
        }
        type="range"
        value={
          characters[activeKeyframeEditor().char].keyframes[
            activeKeyframeEditor().id
          ].rot
        }
        min={0}
        max={360}
        class={inputStyles}
      />

      <label>flip</label>
      <input
        onChange={(e) =>
          setCharacters(
            activeKeyframeEditor().char,
            "keyframes",
            activeKeyframeEditor().id,
            "flip",
            e.target.checked,
          )
        }
        type="checkbox"
        checked={
          characters[activeKeyframeEditor().char].keyframes[
            activeKeyframeEditor().id
          ].flip
        }
      />

      <label>visible</label>
      <input
        onChange={(e) =>
          setCharacters(
            activeKeyframeEditor().char,
            "keyframes",
            activeKeyframeEditor().id,
            "visible",
            e.target.checked,
          )
        }
        type="checkbox"
        checked={
          characters[activeKeyframeEditor().char].keyframes[
            activeKeyframeEditor().id
          ].visible
        }
      />

      <label>zindex</label>
      <input
        class={inputStyles}
        onChange={(e) =>
          setCharacters(
            activeKeyframeEditor().char,
            "keyframes",
            activeKeyframeEditor().id,
            "zindex",
            +e.target.value,
          )
        }
        value={
          characters[activeKeyframeEditor().char].keyframes[
            activeKeyframeEditor().id
          ].zindex
        }
      />

      <button
        class="bg-neutral-300 hover:bg-neutral-200 rounded col-span-2 py-2 transition-all"
        onClick={() => setActiveKeyframeEditor(undefined)}
      >
        Close
      </button>
    </div>
  );
};

export const Character: Component<{
  img: string;
  character: keyof typeof characters;
}> = (props) => {
  const state = (): CharacterState => {
    let keyframes = characters[props.character].keyframes;
    let t = time();

    if (keyframes.length == 1) {
      return keyframes[0];
    }

    let length = keyframes.length;
    let i = 0;
    for (; i < length; i++) {
      t -= keyframes[i].length;
      if (t <= 0) {
        i += 1;
        break;
      }
    }
    i -= 1;

    if (!keyframes[i + 1]) return keyframes[0];

    let factor = (t + keyframes[i].length) / keyframes[i].length;

    return {
      x: lerp(keyframes[i].x, keyframes[i + 1].x, factor),
      y: lerp(keyframes[i].y, keyframes[i + 1].y, factor),
      rot: lerp(keyframes[i].rot, keyframes[i + 1].rot, factor),
      scale: lerp(keyframes[i].scale, keyframes[i + 1].scale, factor),
      zindex: keyframes[i].zindex,
      visible: keyframes[i].visible,
      flip: keyframes[i].flip,
      passive_animation: keyframes[i].passive_animation,
    };
  };

  return (
    <>
      {state().visible && (
        <img
          onClick={() => {
            if (window["DEVMODE"]) setActiveKeyframeEditor();
          }}
          style={{
            "z-index": state().zindex,
            width: "512px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) translate(${(state().x * window.screen.width) / 2}px, ${(state().y * window.screen.height) / 2}px) ${state().flip ? "scaleX(-1)" : ""} rotate(${state().rot}deg) scale(${state().scale})`,
          }}
          src={props.img}
        />
      )}
    </>
  );
};

const KeyframeNode: Component<{
  charName: keyof typeof characters;
  id: number;
}> = (props) => {
  const [showTimeEditor, setShowTimeEditor] = createSignal(false);

  const isHighlighted = (): number | undefined => {
    let t = time();

    let length = characters[props.charName].keyframes.length;
    for (let i = 0; i < length; i++) {
      t -= characters[props.charName].keyframes[i].length;
      if (t < 0) {
        if (i == props.id) {
          return -t;
        } else {
          return undefined;
        }
      }
    }

    return undefined;
  };

  return (
    <>
      <button
        onClick={() => {
          setActiveKeyframeEditor({ char: props.charName, id: props.id });

          let t = 0;
          let length = Math.min(
            props.id,
            characters[props.charName].keyframes.length - 1,
          );
          for (let i = 0; i < length; i++) {
            t += characters[props.charName].keyframes[i].length;
          }

          setTime(t);
        }}
        class="flex items-center"
      >
        <div class={`w-4 h-4 rounded-full z-30 bg-yellow-900`}></div>

        <div
          class="relative h-3"
          style={{
            width: `${characters[props.charName].keyframes[props.id].length * 10 + 6}px`,
          }}
        >
          <div
            class={`rounded-md h-3 absolute top-0 ml-[-8px] z-10 bg-yellow-800`}
            style={{
              width: `${characters[props.charName].keyframes[props.id].length * 10 + 6}px`,
            }}
          ></div>

          {isHighlighted() && (
            <div
              class={`rounded-md h-3 absolute top-0 ml-[-8px] z-20 bg-indigo-800`}
              style={{
                width: `${(characters[props.charName].keyframes[props.id].length - isHighlighted()) * 10 + 6}px`,
              }}
            ></div>
          )}
        </div>
      </button>
    </>
  );
};

const [loadDataMenuShown, setLoadDataMenuShown] = createSignal(false);
const LoadDataMenu: Component = () => {
  const [menuText, setMenuText] = createSignal("");

  return (
    <div class="p-2 rounded-md border-neutral-300 bg-white fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col gap-2">
      <label class="font-bold">Paste JSON:</label>

      <textarea
        onInput={(e) => setMenuText(e.target.value)}
        value={menuText()}
        class="bg-neutral-200 border-neutral-300 resize-y rounded p-2 w-72 h-24 font-mono"
      />

      <div class="grid grid-cols-2 gap-2">
        <button
          onClick={() => setLoadDataMenuShown(false)}
          class="rounded bg-neutral-300 hover:bg-neutral-200 py-2"
        >
          Close
        </button>
        <button
          onClick={() => {
            setCharacters(JSON.parse(menuText()));
          }}
          class="rounded bg-blue-800 hover:bg-blue-700 py-2 text-white"
        >
          Load
        </button>
      </div>
    </div>
  );
};

const Timeline: Component = () => {
  const maxKeyframeTime = () => {
    return Math.max(
      ...characterNames.map((charName) =>
        characters[charName].keyframes
          .map((kf) => kf.length)
          .reduce((a, b) => a + b),
      ),
    );
  };

  const [saveText, setSaveText] = createSignal("save");

  return (
    <div class="flex gap-2">
      <button
        onClick={() => {
          setLoadDataMenuShown(true);
        }}
        class="bg-blue-800 hover:bg-blue-700 rounded text-white px-2"
      >
        load
        <Portal>{loadDataMenuShown() && <LoadDataMenu />}</Portal>
      </button>

      <button
        onClick={() => {
          console.log(JSON.parse(JSON.stringify(characters)));
          navigator.clipboard.writeText(JSON.stringify(characters)).then(() => {
            setSaveText("copied!");
            setTimeout(() => {
              setSaveText("save");
            }, 2000);
          });
        }}
        class="bg-blue-800 hover:bg-blue-700 rounded text-white px-2"
      >
        {saveText()}
      </button>

      <button
        class="w-24 bg-orange-800 rounded text-white"
        onClick={() => setPlaying((x) => !x)}
      >
        {playing() ? "playing" : "paused"}
      </button>

      <span class="font-mono">{time().toFixed(2)}s</span>

      <input
        class="w-full"
        type="range"
        onInput={(e) => {
          audioPlayerRef.currentTime = +e.target.value;
          setTime(+e.target.value);
        }}
        value={time()}
        step={0.01}
        min={0}
        max={Math.max(maxKeyframeTime(), 5)}
      />
    </div>
  );
};

export const AnimationEditor: Component<{ shown: boolean }> = (props) => {
  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === " ") {
      setPlaying((p) => !p);
    }
  };

  onMount(() => {
    addEventListener("keypress", onKeyPress);
  });
  onCleanup(() => {
    removeEventListener("keypress", onKeyPress);
  });

  let prevTime = undefined;

  const play = () => {
    if (!prevTime) prevTime = performance.now();
    let now = performance.now();
    setTime((t) => t + (now - prevTime) / 1000);
    prevTime = now;

    if (playing()) requestAnimationFrame(play);
    else prevTime = undefined;
  };

  createEffect(() => {
    if (playing()) {
      audioPlayerRef.play();
      play();
    } else {
      audioPlayerRef.pause();
    }
  });

  return (
    <>
      <audio
        onEnded={() => {
          setGameState({ type: "DINOFACT", fact_id: 1 });
        }}
        ref={audioPlayerRef}
        src="/assets/voicelines.wav"
      />

      {props.shown && (
        <div class="fixed bottom-4 left-4 right-4 border border-neutral-300 rounded-md h-72 bg-white flex flex-col p-2 gap-2 z-50 overflow-y-auto">
          {activeKeyframeEditor() && (
            <Portal>
              <KeyframeEditor />
            </Portal>
          )}

          <Timeline />

          <div class="grid grid-cols-[150px_auto] h-full">
            <div class="flex flex-col gap-2 justify-center self-start">
              <For each={characterNames}>
                {(charName) => (
                  <div class="h-8 bg-neutral-200 rounded-l-md flex gap-2 items-center justify-between">
                    <span class="pl-2">{charName}</span>

                    <button
                      class="text-nowrap p-1 w-8 h-8 bg-blue bg-blue-700 hover:bg-blue-600 transition-all text-white"
                      onClick={() => {
                        console.log("creating keyframe");
                        setCharacters(
                          charName,
                          "keyframes",
                          characters[charName].keyframes.length,
                          {
                            ...characters[charName].keyframes[
                              characters[charName].keyframes.length - 1
                            ],
                          }, // { ...BASE_KEYFRAME },
                        );
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </For>
            </div>
            <div class="overflow-auto h-full">
              <div class="gap-2 flex flex-col min-w-min">
                <For each={characterNames}>
                  {(charName) => (
                    <div class="flex gap-2 h-8 px-4 rounded-r-md bg-neutral-100">
                      <For each={characters[charName].keyframes}>
                        {(_keyframe, i) => (
                          <KeyframeNode charName={charName} id={i()} />
                        )}
                      </For>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

let audioPlayerRef: HTMLAudioElement = undefined;
