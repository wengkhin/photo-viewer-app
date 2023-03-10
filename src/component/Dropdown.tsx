import { useEffect, useRef, useState } from "react";

import styles from "./Dropdown.module.scss";

import LoadingSpinner from "./LoadingSpinner";
import Badge from "./Badge";

export interface Item {
  key: string;
  text: string;
  value: string | number;
}

interface DropdownProps {
  items?: Item[];
  onChange: (items: Item[]) => void;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  values: Item[];
  setValues: (val: Item[]) => void;
}

export function Dropdown(props: DropdownProps) {
  const {
    items: data,
    onChange,
    label,
    disabled,
    loading,
    values,
    setValues,
  } = props;

  const [items, setItems] = useState<Item[]>(data || []);
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(data || []);
  }, [data]);

  useEffect(() => {
    onChange(values);

    if (items.length === 0) {
      setOpen(false);
      return;
    }
  }, [values, items, onChange]);

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
      {loading && <LoadingSpinner />}
      <div
        className={`${styles.badgeBox} ${
          disabled || loading ? styles.disabled : undefined
        }`}
        onClick={() => {
          if (disabled === true || loading === true) return;

          items.length > 0 && setOpen((prev) => !prev);
        }}
      >
        {!loading && values.length === 0 && (
          <span className={styles.label}>{label}</span>
        )}
        {values?.map((val: Item) => (
          <Badge
            text={val.text}
            key={`${val.key}-badge`}
            removeHandler={() => {
              setValues(values.filter((dd) => dd !== val));
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
                if (!values?.includes(d)) {
                  setValues(values ? [...values, d] : [d]);
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
