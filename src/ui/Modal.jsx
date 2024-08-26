///////////////////////////////////////////////
///                                         ///
///     REUSABLE MODAL REACT COMPONENT      ///
///                                         ///
///////////////////////////////////////////////

import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { cloneElement, createContext, useState, useContext } from "react";
import useOutsideClick from "../hooks/useOutsideClick";

// Styled component
const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

// Styled component
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

// Styled component
const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

// CONTEXT CREATED
const ModalContext = createContext();

// MODAL COMPONENT
function Modal({ children }) {
  // Hook for setting the name of the modal that has to be opened
  const [openName, setOpenName] = useState("");

  // Arrow function for closing the modal by setting the name to '' string
  const close = () => setOpenName("");

  // setOpenName (name setter function) assigned to open for passing it down to children with provider
  const open = setOpenName;

  // returns ModalContext.Provider with value of openName (name of the modal window, close, open)
  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

// Setting PropTypes
Modal.propTypes = {
  children: PropTypes.node,
};

// React component which returns the copy of the element passed to it as children with props of developers choice
function Open({ children, opens: opensWindowName }) {
  // open function extracted from the ModalContext
  const { open } = useContext(ModalContext);

  // returns clonedElement with onClick prop set to the name passed to it for specifying the modal name
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

// Setting PropTypes for Open
Open.propTypes = {
  children: PropTypes.node,
  opens: PropTypes.any,
};

// Window Component (The main component used for creating the window for displaying the modal)
function Window({ children, name }) {
  // Extracting openName, close from the Modalcontext
  const { openName, close } = useContext(ModalContext);

  // using a ref from a customHook for handling the feature of closing the modal by clicking outside the modal
  const ref = useOutsideClick(close);

  // if name is not set then no modal is displayed and null is returned
  if (name !== openName) return null;

  // In Order to display the element outside of the main DOM structure, the whole modal is passed to a function createPortal(element, positionWhereItNeedsToBeDisplayed).
  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

// setting PropTypes for Window
Window.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};

// Setting Open and Window Components as properties of Modal (using the feature of JavaScript in which we can attach properties to almost anything)
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
