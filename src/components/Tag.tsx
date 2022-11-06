import type { Component } from "solid-js";
import { JSX, children } from "solid-js";

import classes from "./Tag.module.css";

interface IProps {
    name: string;
    children?: JSX.Element;
}

const Tag: Component<IProps> = (props: IProps) => {
    const c = children(() => props.children);

    return (
        <div class={classes.Tag}>
            <span>{props.name}</span>
            <div class={classes.Tag__data}>{c()}</div>
        </div>
    );
};

export default Tag;
