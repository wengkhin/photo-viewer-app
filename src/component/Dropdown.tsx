import React, { useEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.scss";

interface DropdownProps {
  items?: Item[];
  onChange: (items: Item[]) => void;
  label?: string;
}

export interface Item {
  key: string;
  text: string;
  value: string | number;
}

export function Dropdown(props: DropdownProps) {
  const { items: data, onChange, label } = props;

  const [items, setItems] = useState<Item[]>(data || []);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(data || []);
  }, [data]);

  useEffect(() => {
    onChange(selectedItems);

    if (items.length === 0) {
      setOpen(false);
      return;
    }
  }, [selectedItems, items, onChange]);

  useEffect(() => {
    function handleClickOutside(event: TouchEvent | MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as HTMLDivElement)
      ) {
        setOpen(false);
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
        onClick={() => {
          items.length > 0 && setOpen((prev) => !prev);
        }}
      >
        {selectedItems.length === 0 && (
          <span className={styles.label}>{label}</span>
        )}
        {selectedItems?.map((val: Item) => (
          <Badge
            text={val.text}
            key={`${val.key}-badge`}
            removeHandler={() => {
              setSelectedItems(selectedItems.filter((dd) => dd !== val));
              setItems([...items, val]);
            }}
          />
        ))}
      </div>
      {open && (
        <div className={styles.menu} ref={menuRef}>
          {items.map((d) => (
            <div
              className={styles.item}
              key={`${d.key}-item`}
              onClick={() => {
                if (!selectedItems?.includes(d)) {
                  setSelectedItems(selectedItems ? [...selectedItems, d] : [d]);
                  setItems(items.filter((dd) => dd !== d));
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
