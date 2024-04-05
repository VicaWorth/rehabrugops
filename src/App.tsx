import { createSignal, type Component } from 'solid-js';
import { createStore } from 'solid-js/store';

window["DEVMODE"] = true;

type CharacterState = "talking" | "static";

const [characters, setCharacters] = createStore({
    "rugops": {
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        flip: false,
        state: "talking" as CharacterState,
    },
});


const CharacterPosEditor: Component<{
    character: keyof typeof characters
}> = (props) => {
    const inputStyles = "p-2 rounded-md border border-neutral-300";

    return (
        <div class='bg-white items-center rounded-lg border border-neutral-300 grid grid-cols-[min-content,1fr] w-72 p-2 fixed top-4 left-4 gap-2'>
            <label>x</label>
            <input
                onInput={(e) => setCharacters(props.character, "x", +e.target.value)}
                type="range" value={characters[props.character].x} step={0.01} min={-1} max={1} class={inputStyles} />

            <label>y</label>
            <input
                onInput={(e) => setCharacters(props.character, "y", +e.target.value)}
                type="range" value={characters[props.character].y} step={0.01} min={-1} max={1} class={inputStyles} />

            <label>scale</label>
            <input
                onInput={(e) => setCharacters(props.character, "scale", +e.target.value)}
                type="range" value={characters[props.character].scale} step={0.01} min={0.1} max={4} class={inputStyles} />

            <label>rot</label>
            <input
                onInput={(e) => setCharacters(props.character, "rot", +e.target.value)}
                type="range" value={characters[props.character].scale} min={0} max={360} class={inputStyles} />

            <label>flip</label>
            <input
                onChange={(e) => setCharacters(props.character, "flip", e.target.checked)}
                type="checkbox" checked={characters[props.character].flip} />

            <button class='bg-blue-700 transition-all hover:bg-blue-600 text-white rounded px-4 py-2 col-span-2'>Copy Coordinates</button>
        </div>
    );
};

const Character: Component<{
    img: string,
    character: keyof typeof characters,
}> = (props) => {
    const [posEditorShown, setPosEditorShown] = createSignal(false);
    const c = () => characters[props.character];

    return <>
        <img
            onClick={() => {
                if (window["DEVMODE"])
                    setPosEditorShown(shown => !shown);
            }}
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) translate(${c().x * window.screen.width / 2}px, ${c().y * window.screen.height / 2}px) ${c().flip ? 'scaleX(-1)' : ''} rotate(${c().rot}deg) scale(${c().scale})`
            }}
            src={props.img} />

        {posEditorShown() && <CharacterPosEditor character={props.character} />}
    </>
};

const AnimationViewer = () => {

};

const App: Component = () => {
    return (
        <div class='w-screen h-screen relative overflow-hidden'>
            <Character character='rugops' img="/assets/characters/char_ruggy.png" />

            <div class="w-full h-full bg-cover bg-[url('/assets/background1.jpg')]" />
        </div>
    );
};

export default App;
