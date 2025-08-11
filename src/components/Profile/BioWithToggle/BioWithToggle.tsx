import React, { useState } from "react";
import styles from "./BioWithToggle.module.css";

const clampLength = 130;

interface BioWithToggleProps {
  text: string | undefined;
}

const BioWithToggle: React.FC<BioWithToggleProps> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const lines = text.split("\n");

  const renderClamped = () => {
    let charCount = 0;
    const clampedLines = [];

    for (const line of lines) {
      if (charCount >= clampLength) break;

      const remaining = clampLength - charCount;
      if (line.length <= remaining) {
        clampedLines.push(line);
        charCount += line.length;
      } else {
        clampedLines.push(line.slice(0, remaining));
        charCount += remaining;
        break;
      }
    }

    return clampedLines.map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i === clampedLines.length - 1 ? "..." : <br />}
      </React.Fragment>
    ));
  };

  const renderFull = () =>
    lines.map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));

  return (
    <p className={styles.bioText}>
      {expanded ? renderFull() : renderClamped()}{" "}
      <button
        onClick={() => setExpanded(!expanded)}
        className={styles.toggleButton}
        type="button"
      >
        {expanded ? "less" : "more"}
      </button>
    </p>
  );
};

export default BioWithToggle;
