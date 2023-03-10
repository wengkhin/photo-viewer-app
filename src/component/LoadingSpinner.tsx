import styles from "./LoadingSpinner.module.scss";

// Credit goes to https://loading.io/css/
function LoadingSpinner() {
  return (
    <div className={styles.ldsEllipsis}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default LoadingSpinner;
