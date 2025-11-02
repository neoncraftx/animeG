import { useState, useEffect, type CSSProperties } from "react";
import { Button } from "./Button";
import { AiOutlineHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import { LuNewspaper } from 'react-icons/lu';
export function MenuAmburger() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const toggle = () => setToggleMenu(!toggleMenu);

  // Gestionnaire de clic en dehors du menu
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      !target.closest(".menu-hamburger") &&
      !target.closest(".menu-trigger")
    ) {
      setToggleMenu(false);
    }
  };

  // Ajouter/retirer l'écouteur d'événement pour le clic en dehors
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className="menu-trigger"
        onClick={toggle}
        style={{
          cursor: "pointer",
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 1000,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 6H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 12H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 18H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        className="menu-hamburger bg-primary h-100 position-fixed top-0"
        style={{
          width: "345px",
          transform: `translateX(${toggleMenu ? "0" : "-100%"})`,
          transition: "transform 0.3s ease-in-out",
          zIndex: 999,
        }}
      >
        <br />
        <br />
        <MenuAmburgerItems />
      </div>
    </>
  );
}
export function MenuAmburgerItems() {
  const width = "100%";
  const style: CSSProperties = {
    padding: "13px 20px",
    width: width,
    marginBottom: 10,
    transition: "1s ease",
    textDecoration: "none"
  };
  return (
    <div className="d-flex align-items-center justify-content-center flex-column p-3 ">
      <Link to="/" style={style}>
        <Button
          label="Accueil"
          icon={<AiOutlineHome size={20}></AiOutlineHome>}
          style={style}
          iconPosition="left"
          textAlign="left"
          classNames={["hoverMenuAmburgerButton", "bgMenuAmburgerButton"]}
        ></Button>
      </Link>
      <Link to="/log" style={style}>
        <Button
          label="Loggeurs"
          icon={<LuNewspaper size={20}></LuNewspaper>}
          iconPosition="left"
          style={style}
          textAlign="left"
          classNames={["hoverMenuAmburgerButton", "bgMenuAmburgerButton"]}
        ></Button>
      </Link>
    </div>
  );
}

export function MenuAmburgerItemsList() {
  return (
    <div className="d-flex align-items-center justify-content-center flex-column p-3"></div>
  );
}
