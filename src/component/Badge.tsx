import styles from "./Badge.module.scss";

interface BadgeProps {
  text: string;
  removeHandler: () => void;
}

function Badge(props: BadgeProps) {
  return (
    <span className={styles.badge}>
      {props.text}{" "}
      <span className={styles.remove} onClick={() => props.removeHandler()}>
        X
      </span>
    </span>
  );
}

export default Badge;
