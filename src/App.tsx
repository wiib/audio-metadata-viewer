import { Component, createSignal, JSX } from "solid-js";
import * as musicMetadata from "music-metadata-browser";

import styles from "./App.module.css";
import Tag from "./components/Tag";

const App: Component = () => {
    const [metadata, setMetadata] = createSignal<musicMetadata.IAudioMetadata | null>(null);

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
                    <img src="https://pbs.twimg.com/media/E6rSmNPXsAMW5ca.jpg:large" alt="" />
                    <div>{/* put tags here */}</div>
                </div>
                <hr />
                <div class={`${styles["page-content__item"]} ${styles["tags-container"]}`}>
                    <h1>Tags</h1>
                    <div>{/* put tags here */}</div>
                </div>
            </main>
        </div>
    );
};

export default App;
