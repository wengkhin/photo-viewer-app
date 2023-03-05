import React, { useEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.scss";

interface DropdownProps {
  data: item[];
}

interface item {
  key: string;
  text: string;
  value: string;
}

function Dropdown(props: DropdownProps) {
  const [data, setData] = useState(props.data);
  const [selectedValue, setSelectedValue] = useState(props.data);

  const [open, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: TouchEvent | MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as HTMLDivElement)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className={styles.dropdown}>
      <div
        className={styles.badgeBox}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {[...Array(10)].map((x, i) => (
          <Badge />
        ))}
      </div>
      {open && (
        <div className={styles.menu} ref={menuRef}>
          {[...Array(10)].map((x, i) => (
            <div className={styles.item}>
              <span className={styles.text}>Item {i}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Badge() {
  return (
    <span className={styles.badge}>
      New <span className={styles.remove}>X</span>
    </span>
  );
}

export default Dropdown;
