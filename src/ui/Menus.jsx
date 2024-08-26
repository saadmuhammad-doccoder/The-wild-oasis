import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import PropTypes from "prop-types";
import useOutsideClick from "../hooks/useOutsideClick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

// COMPOUND COMPONENT PATTERN (MENUS)

// Creating Context (MenusContext)
const MenusContext = createContext();

// Menus Component
function Menus({ children }) {
  // useState() hook for using and setting the id of the currently open menu
  const [openId, setOpenId] = useState("");
  // useState() hook for setting and using the position of the menu on the UI
  const [position, setPosition] = useState(null);

  // close() func for setting OpenId to '' to close the menu
  const close = () => setOpenId("");

  // open() which basically references to the setopenId() func from the openId hook
  const open = setOpenId;
  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

// Props for Menus
Menus.propTypes = {
  children: PropTypes.node,
};

// Toggle Component
function Toggle({ id }) {
  // Destructuring the Menuscontext by using the context
  const { openId, close, open, setPosition } = useContext(MenusContext);

  // function for opening and positioning the OPENED Menu
  function handleClick(e) {
    e.stopPropagation();
    // Getting the position of the menu opening button
    const rect = e.target.closest("button").getBoundingClientRect();

    // Setting the position to position the menu on the UI close with the 3 dot icon
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
    // Check if the clicked element is the menu itself
    openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

// Props for Toggle Component
Toggle.propTypes = {
  id: PropTypes.number,
};

// List Component
function List({ id, children }) {
  // Destructuring the Menuscontext by using the context
  const { openId, position, close } = useContext(MenusContext);

  // setting ref by using the useOutSideClick() custom hook passing the close function to it
  const ref = useOutsideClick(close, false);

  // if the openId is not equal to the passed id then return null (or in short close the menu)
  if (openId !== id) return null;

  // In Order to keep the menu on top of everything we used the createPortal from the react DOM Tree in the body of the document(document.body)
  return createPortal(
    <StyledList ref={ref} position={{ x: position.x, y: position.y }}>
      {children}
    </StyledList>,
    document.body
  );
}

// Props for List
List.propTypes = {
  id: PropTypes.number,
  children: PropTypes.node,
};

// Button Component
function Button({ children, icon, onClick, disabled }) {
  // Destructuring the Menuscontext by using the context
  const { close } = useContext(MenusContext);

  // Func for handling click over the button in the menu
  function handleClick() {
    // optional chaining onClick() if it exists call or skip
    onClick?.();

    // close the menu
    close();
  }

  return (
    <li>
      <StyledButton disabled={disabled} onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

// Props for Button Component
Button.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

// Setting Properties for the Menus Component
Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
