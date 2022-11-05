import { Component, createSignal, JSX, Show, For } from "solid-js";
import * as musicMetadata from "music-metadata-browser";

import styles from "./App.module.css";
import Tag from "./components/Tag";

interface IObject {
    [key: string]: any;
}

interface ISeparatedTags {
    common: IObject;
    format: IObject;
    native: IObject;
}

const App: Component = () => {
    const [metadata, setMetadata] = createSignal<musicMetadata.IAudioMetadata | null>(null);

    const flattenObject = (object: IObject, newObject: IObject, prevKey: string) => {
        for (let key in object) {
            let value = object[key];

            if (key == "picture") continue;

            if (value && typeof value !== "object" && !Array.isArray(value)) {
                if (prevKey == null || prevKey == "") {
                    newObject[key] = value;
                } else {
                    if (key == null || key == "") {
                        newObject[prevKey] = value;
                    } else {
                        newObject[`${prevKey}.${key}`] = value;
                    }
                }
            } else {
                if (prevKey == null || prevKey == "") {
                    flattenObject(value, newObject, key);
                } else {
                    flattenObject(value, newObject, `${prevKey}.${key}`);
                }
            }
        }
    };

    const parseObject = (object: IObject) => {
        let newObject: IObject = {};

        flattenObject(object, newObject, "");

        return Object.entries(newObject).map((value, index) => {
            return <Tag name={value[0]} data={value[1]} />;
        });
    };

    const onLoadFile: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
        const file = event.currentTarget.files?.item(0) as Blob;
        musicMetadata.parseBlob(file).then((meta) => {
            setMetadata(meta);
            console.log(metadata());
        });
    };

    return (
        <div class={styles.App}>
            <header class={styles["page-header"]}>
                <h1>Audio Metadata Viewer</h1>
                <input
                    accept="audio/*"
                    type="file"
                    name="loadFile"
                    id="loadFile"
                    onChange={onLoadFile}
                />
            </header>
            <hr />
            <main class={styles["page-content"]}>
                <div class={`${styles["page-content__item"]} ${styles["covers-container"]}`}>
                    <h1>Covers</h1>
                    <div>{/* put tags here */}</div>
                </div>
                <hr />
                <div class={`${styles["page-content__item"]} ${styles["tags-container"]}`}>
                    <h1>Tags</h1>
                    <Show when={metadata()}>
                        <h2>Common Tags</h2>
                        <div>
                            <For each={parseObject(metadata()!.common)}>{(item) => item}</For>
                        </div>
                        <h2>Format Tags</h2>
                        <div>
                            <For each={parseObject(metadata()!.format)}>{(item) => item}</For>
                        </div>
                        <h2>Native Tags</h2>
                        <div>
                            {/* <For each={parseObject(metadata()!.native)}>{(item) => item}</For> */}
                        </div>
                    </Show>
                </div>
            </main>
        </div>
    );
};

export default App;
