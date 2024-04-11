import { Component, Match, Switch, createEffect, createSignal } from "solid-js";
import { AnimationEditor, Character } from "./AnimationEditor";

type GameState =
  | { type: "CUTSCENE"; cutscene_id: number }
  | { type: "TITLESCREEN" }
  | { type: "CREDITS" };

export const [gameState, setGameState] = createSignal<GameState>({
  type: "TITLESCREEN",
});

const TitleScreen: Component = () => {
  return (
    <div class="flex flex-col w-full justify-center text-center mt-[25%] gap-8">
      <h1 class="text-7xl font-extrabold">Rehab Rugops</h1>
      <div class="flex flex-col gap-4 text-3xl place-items-center">
        <button
          onClick={() => setGameState({ type: "CUTSCENE", cutscene_id: 0 })}
          class="p-6 border-4 rounded-lg w-72 border-neutral-300 hover:bg-neutral-300 transition-colors"
        >
          Play
        </button>
        <button
          onClick={() => setGameState({ type: "CREDITS" })}
          class="p-6 border-4 rounded-lg w-72 border-neutral-300 hover:bg-neutral-300 transition-colors"
        >
          Credits
        </button>
      </div>
    </div>
  );
};

const CutsceneViewer: Component = () => {
  const [shown, setShown] = createSignal(true);

  return (
    <div class="w-screen h-screen relative overflow-hidden">
      <Character character="rugops" img="/assets/characters/char_ruggy.png" />
      <Character character="kat" img="/assets/characters/char_kat.png" />
      <Character
        character="bankteller"
        img="/assets/characters/char_antarctopelta_bankteller.png"
      />
      <Character character="dinocity" img="/assets/dinocity.jpg" />
      <Character character="office" img="/assets/office.jpg" />
      <Character character="bank" img="/assets/bank.jpg" />
      <Character character="meteor" img="/assets/meteor.jpg" />
      <Character character="bankint" img="/assets/bankint.jpg" />

      <div class="w-full h-full bg-cover bg-[url('/assets/background1.jpg')]" />

      <button
          class="text-nowrap p-1 w-15 h-8 bg-blue bg-blue-700 hover:bg-blue-600 transition-all text-white fixed top-4 right-4 z-50"
          onClick={() => {
            setShown(x => !x);
          }}
        >
          visible
        </button>

      { shown() && <AnimationEditor /> }
    </div>
  );
};

const Credits: Component = () => {
  return (
    <div class="bg-black p-4 flex flex-col h-screen">
      <button
        class="text-white text-left hover:underline mb-4"
        onClick={() => setGameState({ type: "TITLESCREEN" })}
      >
        back.
      </button>

      <a
        target="_blank"
        class="text-white hover:underline"
        href="https://github.com/kil0meters"
      >
        Miles Benton
      </a>
      <a
        target="_blank"
        class="text-white hover:underline"
        href="https://github.com/ryantheryan-code"
      >
        Ryan Makela
      </a>
      <a
        target="_blank"
        class="text-white hover:underline"
        href="https://github.com/VicaWorth"
      >
        Victoria Worthington
      </a>
    </div>
  );
};

const App: Component = () => {
  return (
    <Switch>
      <Match when={gameState().type === "TITLESCREEN"}>
        <TitleScreen />
      </Match>

      <Match when={gameState().type === "CUTSCENE"}>
        <CutsceneViewer />
      </Match>

      <Match when={gameState().type === "CREDITS"}>
        <Credits />
      </Match>
    </Switch>
  );
};

export default App;
