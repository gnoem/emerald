import React from "react";
import styles from "./title.module.css";

const Title: React.FC = ({ children = 'emerald village' }): JSX.Element => {
  return (
    <div className={styles.Title}>
      {children}
    </div>
  );
}

export default Title;