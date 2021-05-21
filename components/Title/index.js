import styles from "./title.module.css";

const Title = ({ children = 'emerald village' }) => {
  return (
    <div className={styles.Title}>
      {children}
    </div>
  );
}

export default Title;