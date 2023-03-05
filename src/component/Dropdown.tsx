import React, { useEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.scss";

interface DropdownProps {
  data: Item[];
}

export interface Item {
  key: string;
  text: string;
  value: string | number;
}

export function Dropdown(props: DropdownProps) {
  const [data] = useState(props.data);
  const [selectedValue, setSelectedValue] = useState<Item[]>();

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
        {selectedValue?.map((val) => (
          <Badge text={val.text} key={`${val.key}-badge`} />
        ))}
      </div>
      {open && (
        <div className={styles.menu} ref={menuRef}>
          {data.map((d) => (
            <div
              className={styles.item}
              key={`${d.key}-item`}
              onClick={() => {
                if (!selectedValue?.includes(d)) {
                  setSelectedValue(selectedValue ? [...selectedValue, d] : [d]);
                }
              }}
            >
              <span className={styles.text}>{d.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface BadgeProps {
  text: string;
}

function Badge(props: BadgeProps) {
  return (
    <span className={styles.badge}>
      {props.text} <span className={styles.remove}>X</span>
    </span>
  );
}
