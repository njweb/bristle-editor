import { h, render } from "preact";
import App from "./scripts/App";

import "./site.styl";

const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("Could not find root element");
}
render(<App />, rootEl);
