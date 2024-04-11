import { Component, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";

const SlotValue: Component<{ index: number }> = (props) => {
  return (
    <div class="w-24 h-24">
      <img src={`/assets/slots/dino${props.index}.png`} class="w-24 h-24" />
    </div>
  );
};

const SlotColumn: Component<{ t: number }> = (props) => {
  let offset = () => {
    return -props.t * (5 * (16 + 96));
  };

  return (
    <div class="h-32 overflow-clip">
      <div
        style={{
          translate: `0 ${offset()}px`,
        }}
        class="flex flex-col gap-4 h-full"
      >
        <SlotValue index={1} />
        <SlotValue index={2} />
        <SlotValue index={3} />
        <SlotValue index={4} />
        <SlotValue index={5} />
        <SlotValue index={6} />
      </div>
    </div>
  );
};

const Jackpot: Component = () => {
  const [time, setTime] = createSignal(0);
  const [scale, setScale] = createSignal(0);

  let lastTimestamp = 0;
  const render = (timestamp: number) => {
    requestAnimationFrame(render);
    if (lastTimestamp == 0) {
      lastTimestamp = timestamp;
      return;
    }

    let dt = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    setTime((t) => t + dt / 400);

    if (scale() < 2) {
      setScale((s) => s + dt / 1000);
    }
  };

  onMount(() => {
    requestAnimationFrame(render);
  });

  const OFF = 0.2;

  return (
    <div
      style={{
        transform: `translate(-50%, -50%) scale(${scale() * scale()})`,
      }}
      class="flex z-50 fixed top-[50%] left-[50%] text-yellow-500"
    >
      <span
        class="font-bold text-4xl"
        style={{
          translate: `0 ${Math.sin(time() + OFF) * 40}px`,
        }}
      >
        J
      </span>
      <span
        class="font-bold text-4xl"
        style={{
          translate: `0 ${Math.sin(time() + 2 * OFF) * 40}px`,
        }}
      >
        A
      </span>
      <span
        class="font-bold text-4xl"
        style={{
          translate: `0 ${Math.sin(time() + 3 * OFF) * 40}px`,
        }}
      >
        C
      </span>
      <span
        class="font-bold text-4xl"
        style={{
          translate: `0 ${Math.sin(time() + 4 * OFF) * 40}px`,
        }}
      >
        K
      </span>
      <span
        class="font-bold text-4xl"
        style={{
          translate: `0 ${Math.sin(time() + 5 * OFF) * 40}px`,
        }}
      >
        P
      </span>
      <span
        class="font-bold text-4xl"
        style={{
          translate: `0 ${Math.sin(time() + 6 * OFF) * 40}px`,
        }}
      >
        O
      </span>
      <span
        class="font-bold text-4xl"
        style={{
          translate: `0 ${Math.sin(time() + 7 * OFF) * 40}px`,
        }}
      >
        T
      </span>
      <span
        class="font-bold text-4xl"
        style={{
          translate: `0 ${Math.sin(time() + 8 * OFF) * 40}px`,
        }}
      >
        !
      </span>
    </div>
  );
};

export const SlotMachine: Component = () => {
  const [wheels, setWheels] = createStore([
    0.5715 + 0.97 - 1,
    0.5715 + 0.172,
    0.5715 + 0.775 - 1,
  ] as [number, number, number]);

  const [playerRot, setPlayerRot] = createSignal(0);
  const [spinRot, setSpinRot] = createSignal(0);
  const [showJackpot, setShowJackpot] = createSignal(false);

  let spinning = false;

  let prev = 0;
  let elapsed = 0;
  let spinElapsed = 0;
  let speed = 200;
  const render = () => {
    let now = performance.now();
    let dt = now - prev;
    prev = now;
    elapsed += dt;

    setSpinRot((r) => r + dt * Math.pow(Math.sin(elapsed / 300) * 0.874, 2));

    if (spinning) {
      spinElapsed += dt;

      if (spinElapsed > 4000) speed += dt / 2;

      if (spinElapsed > 0) {
        if (spinElapsed > 4940) setWheels(0, 0.5715);
        else setWheels(0, (old) => (old + dt / speed) % 1);
      }
      if (spinElapsed > 900) {
        if (spinElapsed > 5518) setWheels(1, 0.5715);
        else setWheels(1, (old) => (old + dt / speed) % 1);
      }

      if (spinElapsed > 1800) {
        if (spinElapsed > 6913) setWheels(2, 0.5715);
        else setWheels(2, (old) => (old + dt / speed) % 1);
      }

      if (spinElapsed > 7000) {
        setShowJackpot(true);
        return;
      }

      setPlayerRot(Math.pow(Math.sin(spinElapsed / 200) * 3, 2));
    }

    requestAnimationFrame(render);
  };

  onMount(() => {
    prev = performance.now();
    requestAnimationFrame(render);
  });

  const startSpinning = () => {
    spinning = true;
  };

  return (
    <div class="w-screen h-screen overflow-hidden relative flex flex-col place-items-center justify-center gap-8 bg-[url('/assets/casino.jpg')]">
      {showJackpot() && <Jackpot />}

      <img
        src="/assets/SPINTOWIN.png"
        class="w-80"
        style={{
          transform: `rotate(${-10 + spinRot()}deg)`,
        }}
      />

      <div class="rounded-lg to-blue-400 from-green-400 bg-gradient-to-b flex flex-col items-center mt-8 p-4 shadow-lg gap-4 border-4 border-purple-800">
        <div class="flex gap-4 justify-self-center">
          <SlotColumn t={wheels[0]} />
          <SlotColumn t={wheels[1]} />
          <SlotColumn t={wheels[2]} />
        </div>

        {!showJackpot() && (
          <button
            onClick={startSpinning}
            class="bg-green-800 hover:bg-green-700 px-6 py-4 rounded text-lg text-green-50 hover:-translate-y-1 active:-translate-y-0.5 border-4 border-green-700 active:border-green-900 active:bg-green-900 font-extrabold transition-all"
          >
            SPIN
          </button>
        )}
      </div>

      <img
        style={{
          transform: `scaleX(-1) translateX(40%) translateY(60%) rotate(${30 + playerRot()}deg) scale(0.6)`,
        }}
        class="absolute"
        src="/assets/characters/char_ruggy.png"
      />
    </div>
  );
};
