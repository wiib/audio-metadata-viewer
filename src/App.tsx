import { Component, createSignal, JSX, Show } from "solid-js";
import * as musicMetadata from "music-metadata-browser";

import styles from "./App.module.css";
import Tag from "./components/Tag";

interface IObject {
    [key: string]: any;
}

const App: Component = () => {
    const [metadata, setMetadata] = createSignal<musicMetadata.IAudioMetadata>();

    const flattenHelper = (object: IObject, newObject: IObject, prevKey: string) => {
        for (const key in object) {
            let value = object[key];

            /* Don't try to parse the image ArrayBuffer */
            if (value instanceof Uint8Array) value = `Uint8Array(${value.length})`;

            /* Check that the current value isn't an object of an array */
            if (typeof value !== "object" && !Array.isArray(value)) {
                if (prevKey == null || prevKey == "") {
                    /* If we don't have a previous key, push the current key, value*/
                    newObject[key] = value;
                } else {
                    /* If we do, push prevKey.key, value */
                    newObject[`${prevKey}.${key}`] = value;
                }
            } else if (typeof value == "object" && !Array.isArray(value)) {
                /* If the current value is an object, recurse */
                if (prevKey == null || prevKey == "") {
                    /* If we don't have a previous key, recurse using the current key */
                    flattenHelper(value, newObject, key);
                } else {
                    /* If we do, recurse with prevKey.key */
                    flattenHelper(value, newObject, `${prevKey}.${key}`);
                }
            } else if (Array.isArray(value)) {
                /* If the current value is an array, use index notation instead of object */
                if (prevKey == null || prevKey == "") {
                    value.forEach((x, i) => {
                        if (typeof x !== "object" && !Array.isArray(x)) {
                            if (prevKey == null || prevKey == "") {
                                newObject[`${key}[${i}]`] = x;
                            } else {
                                newObject[`${prevKey}.${key}[${i}]`] = x;
                            }
                        } else {
                            if (prevKey == null || prevKey == "") {
                                flattenHelper(x, newObject, `${key}[${i}]`);
                            } else {
                                flattenHelper(x, newObject, `${prevKey}.${key}[${i}]`);
                            }
                        }
                    });
                }
            }
        }
    };

    const parseObject = (object: IObject) => {
        const result: IObject = {};

        flattenHelper(object, result, "");

        return Object.entries(result).map(([key, value]) => {
            return <Tag name={key}>{String(value)}</Tag>;
        });
    };

    const parseNativeTags = (metadata: musicMetadata.IAudioMetadata) => {
        const elementList: JSX.ArrayElement = [];
        const nativeTags = metadata.native;

        Object.entries(nativeTags).forEach(([tagType, tags]) => {
            elementList.push(<h3>{tagType}</h3>);

            tags.forEach((tag) => {
                if (typeof tag.value == "object" && !(tag.value instanceof Uint8Array)) {
                    const flattenResult: IObject = {};

                    flattenHelper(tag.value, flattenResult, tag.id);

                    elementList.push(
                        Object.entries(flattenResult).map(([key, value]) => {
                            return <Tag name={key}>{String(value)}</Tag>;
                        })
                    );
                } else {
                    elementList.push(<Tag name={tag.id}>{String(tag.value)}</Tag>);
                }
            });
        });

        return elementList;
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
                <Show when={metadata()?.common.picture}>
                    <div class={`${styles["page-content__item"]} ${styles["covers-container"]}`}>
                        <h1>Covers</h1>
                        <div>
                            {metadata()!.common.picture?.length
                                ? metadata()!.common.picture?.map((picture) => {
                                      return (
                                          <div>
                                              <img
                                                  src={URL.createObjectURL(
                                                      new Blob([picture.data], {
                                                          type: picture.format,
                                                      })
                                                  )}
                                                  alt={picture.description}
                                              />
                                              <Tag name="type">{picture.type}</Tag>
                                              <Tag name="format">{picture.format}</Tag>
                                              <Tag name="name">{picture.name}</Tag>
                                              <Tag name="description">{picture.description}</Tag>
                                          </div>
                                      );
                                  })
                                : "This file does not have embedded covers."}
                        </div>
                    </div>
                    <hr />
                </Show>
                <div class={`${styles["page-content__item"]} ${styles["tags-container"]}`}>
                    <h1>Tags</h1>
                    <Show when={metadata()}>
                        <h2>Common Tags</h2>
                        <div>
                            {parseObject(metadata()!.common).length
                                ? parseObject(metadata()!.common)
                                : "This file does not have common tags."}
                        </div>
                        <h2>Format Tags</h2>
                        <div>
                            {parseObject(metadata()!.format).length
                                ? parseObject(metadata()!.format)
                                : "This file does not have format tags."}
                        </div>
                        <h2>Native Tags</h2>
                        <div>
                            {Object.keys(metadata()!.native).length
                                ? parseNativeTags(metadata()!)
                                : "This file does not have native tags."}
                        </div>
                    </Show>
                </div>
            </main>
        </div>
    );
};

export default App;
