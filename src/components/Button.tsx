import type React from "react";
import { useEffect, useState } from "react";

type boostrapColor = "primary" | "secondary" | "success" | "danger" | "warning";
type boostrapSize = "sm" | "md" | "lg";

type ButtonSpinnerProps = {
  label: string;
  gLabel?: string; // texte quand loading
  loading?: boolean;
  onClick: () => void;
  variant?: boostrapColor;
  size?: boostrapSize;
  icon?: React.ReactNode; // pour un élément JSX (ex: une icône)
};
type ButtonProps = {
  label: string;
  type?: "button" | "submit" | "reset" | undefined;
  focuced?: boolean;
  focucedVariant?: boostrapColor;
  variant?: boostrapColor;
  size?: boostrapSize;
  opacity?: number;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right" | undefined;
  textAlign?: "left" | "center" | "right";
  style?: React.CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
  classNames?: string[]
};

export function ButtonSpinner({
  label,
  gLabel,
  loading,
  onClick,
  variant,
  size,
  icon,
}: ButtonSpinnerProps) {
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  return (
    <button
      className={`btn btn-${variant || "primary"} ${sizeClass}`}
      type="button"
      disabled={loading}
      onClick={onClick}
    >
      {loading ? (
        <span
          className="spinner-border spinner-border-sm"
          aria-hidden="true"
        ></span>
      ) : (
        icon && <span>{icon}</span>
      )}
      <span role="status">{loading ? gLabel : label}</span>
    </button>
  );
}

export function Button({
  label,
  type,
  style,
  disabled = false,
  onClick,
  variant,
  size,
  icon,
  iconPosition,
  textAlign = "left",
  classNames
}: ButtonProps) {
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  const [className, setClassName] = useState(["btn",`btn-${variant || "primary"}`,`${sizeClass}`])
  useEffect(() => {
    const handleClassName = () => {
      const newSetClassName = new Set(classNames)
      newSetClassName.forEach((c) => {
        if(className.includes(c)){
          return
        }
        setClassName([...className, c])
      })
      
    }
    if(Array.isArray(classNames)){
      handleClassName()
    }
  },[classNames])

  const buttonStyles: React.CSSProperties = {
    ...style,
    display: 'flex',
    alignItems: 'center',
    justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'
  };

  return (
    <button
      className={className.join(' ')}
      type={type}
      style={buttonStyles}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && iconPosition === "left" && <span className="me-2">{icon}</span>}
      <span>{label}</span>
      {icon && iconPosition === "right" && <span className="ms-2">{icon}</span>}
    </button>
  );
}
