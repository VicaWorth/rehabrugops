import { Component, createSignal, onMount } from "solid-js";
import { setGameState } from "./App";

const DINO_FACTS = [
  "A triceratops has 3 horns",
  "The largest dinosaur ever discovered is believed to be Patagotitan mayorum, a titanosaur that lived in what is now Argentina. It is estimated to have been longer than a blue whale, which is the largest animal alive today!",
];

export const DinoFact: Component<{ id: number }> = (props) => {
  const [width, setWidth] = createSignal(32);

  let prev = 0;
  const render = () => {
    let dt = performance.now() - prev;

    setWidth((w) => w + dt / 4000);

    if (width() >= 384) {
      setWidth(384);
      if (props.id == 0) setGameState({ type: "CUTSCENE", cutscene_id: 0 });
      if (props.id == 1) setGameState({ type: "SLOTS" });
    } else {
      requestAnimationFrame(render);
    }
  };

  onMount(() => {
    prev = performance.now();
    requestAnimationFrame(render);
  });

  return (
    <div class="w-screen h-screen bg-black text-white flex items-center justify-center flex-col text-center">
      <span class="font-bold text-5xl">DINOSAUR FACT</span>
      <div
        class="rounded-full h-1 bg-white mb-4"
        style={{ width: `${width()}px` }}
      />
      <p>{DINO_FACTS[props.id]}</p>
    </div>
  );
};
