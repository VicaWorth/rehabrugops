import {
  createSignal,
  type Component,
  For,
  onMount,
  createEffect,
} from "solid-js";
import { createStore } from "solid-js/store";
import { lerp } from "./utils";

window["DEVMODE"] = true;

type Keyframe = {
  length: number;
} & CharacterState;

type CharacterState = {
  x: number;
  y: number;
  rot: number;
  scale: number;
  flip: boolean;
  passive_animation: "talking" | "static";
};

const [activeKeyframeEditor, setActiveKeyframeEditor] = createSignal<
  { char: keyof typeof characters; id: number } | undefined
>(undefined);

const [time, setTime] = createSignal(0);
const [playing, setPlaying] = createSignal(false);

const BASE_KEYFRAME = {
  length: 0,

  x: 0,
  y: 0,
  rot: 0,
  scale: 1,
  flip: false,
  passive_animation: "talking",
} satisfies Keyframe;

const [characters, setCharacters] = createStore({
  rugops: {
    keyframes: [{ ...BASE_KEYFRAME }] as Keyframe[],
  },
  kat: {
    keyframes: [{ ...BASE_KEYFRAME }] as Keyframe[],
  },
});

const characterNames = ["rugops", "kat"] as const;

const KeyframeEditor: Component = () => {
  const inputStyles = "p-2 rounded-md border border-neutral-300";

  return (
    <div class="bg-white items-center rounded-lg border border-neutral-300 grid grid-cols-[min-content,1fr] w-72 p-2 fixed top-4 left-4 gap-2">
      <h1 class="text-lg font-bold col-span-2">
        {activeKeyframeEditor().char} Keyframe #{activeKeyframeEditor().id + 1}
      </h1>

      <label class="text-nowrap">length (s)</label>
      <input
        onChange={(e) =>
          setCharacters(
            activeKeyframeEditor().char,
            "keyframes",
            activeKeyframeEditor().id,
            "length",
            +e.target.value,
          )
        }
        class="p-2 rounded border border-neutral-300"
        value={
          characters[activeKeyframeEditor().char].keyframes[
            activeKeyframeEditor().id
          ].length
        }
      />

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
        max={4}
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

      <button
        class="bg-neutral-300 hover:bg-neutral-200 rounded col-span-2 py-2 transition-all"
        onClick={() => setActiveKeyframeEditor(undefined)}
      >
        Close
      </button>
    </div>
  );
};

const Character: Component<{
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
      flip: keyframes[i].flip,
      passive_animation: keyframes[i].passive_animation,
    };
  };

  return (
    <>
      <img
        onClick={() => {
          if (window["DEVMODE"]) setActiveKeyframeEditor();
        }}
        style={{
          width: "512px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translate(${(state().x * window.screen.width) / 2}px, ${(state().y * window.screen.height) / 2}px) ${state().flip ? "scaleX(-1)" : ""} rotate(${state().rot}deg) scale(${state().scale})`,
        }}
        src={props.img}
      />
    </>
  );
};

const KeyframeNode: Component<{
  charName: keyof typeof characters;
  id: number;
}> = (props) => {
  const [showTimeEditor, setShowTimeEditor] = createSignal(false);

  const isHighlighted = () => {
    let t = time();

    let length = characters[props.charName].keyframes.length;
    for (let i = 0; i < length; i++) {
      t -= characters[props.charName].keyframes[i].length;
      if (t <= 0) {
        if (i == props.id) {
          return true;
        } else {
          return false;
        }
      }
    }

    return false;
  };

  return (
    <>
      <button
        onClick={() => {
          setActiveKeyframeEditor({ char: props.charName, id: props.id });
        }}
        class="flex items-center"
      >
        <div
          class={`w-4 h-4 rounded-full z-20 ${isHighlighted() ? "bg-indigo-900" : "bg-yellow-900"}`}
        ></div>

        <div
          class={`rounded-md h-3 ml-[-8px] z-10 ${isHighlighted() ? "bg-indigo-800" : "bg-yellow-800"}`}
          style={{
            width: `${characters[props.charName].keyframes[props.id].length * 10 + 6}px`,
          }}
        ></div>
      </button>
    </>
  );
};

const Timeline: Component = () => {
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
    if (playing()) play();
  });

  const maxKeyframeTime = () => {
    return Math.max(
      ...characterNames.map((charName) =>
        characters[charName].keyframes
          .map((kf) => kf.length)
          .reduce((a, b) => a + b),
      ),
    );
  };

  return (
    <div class="flex gap-2">
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
        onInput={(e) => setTime(+e.target.value)}
        value={time()}
        step={0.01}
        min={0}
        max={Math.max(maxKeyframeTime(), 5)}
      />
    </div>
  );
};

const AnimationEditor: Component = () => {
  return (
    <div class="fixed bottom-4 left-4 right-4 border border-neutral-300 rounded-md h-72 bg-white flex flex-col p-2 gap-2">
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
                      { ...BASE_KEYFRAME },
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
  );
};

const App: Component = () => {
  return (
    <div class="w-screen h-screen relative overflow-hidden">
      {activeKeyframeEditor() && <KeyframeEditor />}

      <Character character="rugops" img="/assets/characters/char_ruggy.png" />
      <Character character="kat" img="/assets/characters/char_kat.png" />

      <div class="w-full h-full bg-cover bg-[url('/assets/background1.jpg')]" />

      <AnimationEditor />
    </div>
  );
};

export default App;
