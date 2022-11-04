import type { Component } from "solid-js";

import classes from "./Tag.module.css";

interface IProps {
    name: string;
    data: string;
}

const Tag: Component<IProps> = (props: IProps) => {
    return (
        <div class={classes.Tag}>
            <span class="name">{props.name}</span>
            <span class="data">{props.data}</span>
        </div>
    );
};

export default Tag;
