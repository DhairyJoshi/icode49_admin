import React from 'react';
import styled from 'styled-components';

const Checkbox = ({ checked, onChange, id }) => {
  return (
    <StyledWrapper>
      <label className="container">
        <input type="checkbox" checked={checked} onChange={onChange} id={id} />
        <svg viewBox="0 0 64 64" height="16" width="16">
          <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" className="path" />
        </svg>
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
  }

  .container input {
    display: none;
  }

  .container svg {
    overflow: visible;
    display: block;
    width: 16px;
    height: 16px;
  }

  .path {
    fill: none;
    stroke: #db2777; /* Tailwind pink-600 */
    stroke-width: 6;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke-dasharray 0.5s ease;
    stroke-dasharray: 0 0 240 9999999;
    stroke-dashoffset: 1;
    scale: -1 1;
    transform-origin: center;
    animation: hi 0.5s;
  }

  .container input:checked ~ svg .path {
    stroke-dasharray: 0 262 70 9999999;
    transition-delay: 0s;
    scale: 1 1;
    animation: none;
  }

  @keyframes hi {
    0% {
      stroke-dashoffset: 20;
    }
    to {
      stroke-dashoffset: 1;
    }
  }
`;

export default Checkbox; 