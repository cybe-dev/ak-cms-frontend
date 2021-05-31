import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Alert({
  children,
  color = "red",
  className,
  collapse = false,
}) {
  const [show, setShow] = useState(true);
  let css = "px-5 py-3";
  let colored = "";
  if (color === "red") {
    colored = " bg-red-200 text-red-900";
  } else if (color === "green") {
    colored = " bg-green-200 text-green-900";
  } else if (color === "blue") {
    colored = " bg-blue-200 text-blue-900";
  } else if (color === "yellow") {
    colored = " bg-yellow-200 text-yellow-900";
  }
  css += colored;
  if (className) {
    css += " " + className;
  }
  if (collapse && !show) {
    css += " hidden";
  } else if (collapse) {
    css += " flex items-start";
  }
  return (
    <div className={css}>
      {collapse ? <span className="flex-1">{children}</span> : children}
      {collapse ? (
        <button type="button" onClick={() => setShow(false)} className="px-1">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      ) : null}
    </div>
  );
}
