import React from "react";

export default function LoadingSpinner(props: {
  large?: boolean;
  small?: boolean;
}) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width={props.large ? "40px" : props.small ? "14px" : "20px"}
        stroke="grey"
        speed="0.75"
        data-testid="rotating-lines-svg"
        aria-label="rotating-lines-loading"
        aria-busy="true"
        role="status"
        className="loading-spinner"
      >
        <polyline
          points="24,12 24,4"
          width="5"
          transform="rotate(0, 24, 24)"
          className="sc-dmqHEX eEcjEn"
        ></polyline>
        <polyline
          points="24,12 24,4"
          width="5"
          transform="rotate(30, 24, 24)"
          className="sc-dmqHEX eEcjEn"
        ></polyline>
        <polyline
          points="24,12 24,4"
          width="5"
          transform="rotate(60, 24, 24)"
          className="sc-dmqHEX eEcjEn"
        ></polyline>
        <polyline
          points="24,12 24,4"
          width="5"
          transform="rotate(90, 24, 24)"
          className="sc-dmqHEX eEcjEn"
        ></polyline>
        <polyline
          points="24,12 24,4"
          width="5"
          transform="rotate(120, 24, 24)"
          className="sc-dmqHEX eEcjEn"
        ></polyline>
        <polyline
          points="24,12 24,4"
          width="5"
          transform="rotate(150, 24, 24)"
          className="sc-dmqHEX eEcjEn"
        ></polyline>
        <polyline
          points="24,12 24,4"
          width="5"
          transform="rotate(180, 24, 24)"
          className="sc-dmqHEX eEcjEn"
        ></polyline>
        <polyline
          points="24,12 24,4"
          width="5"
          transform="rotate(210, 24, 24)"
          className="sc-dmqHEX eEcjEn"
        ></polyline>
        <polyline
          points="24,12 24,4"
          width="5"
          transform="rotate(240, 24, 24)"
          className="sc-dmqHEX eEcjEn"
        ></polyline>
        <polyline
          points="24,12 24,4"
          width="5"
          transform="rotate(270, 24, 24)"
          className="sc-dmqHEX eEcjEn"
        ></polyline>
        <polyline
          points="24,12 24,4"
          width="5"
          transform="rotate(300, 24, 24)"
          className="sc-dmqHEX eEcjEn"
        ></polyline>
        <polyline
          points="24,12 24,4"
          width="5"
          transform="rotate(330, 24, 24)"
          className="sc-dmqHEX eEcjEn"
        ></polyline>
      </svg>
      <style>
        {`
        .loading-spinner {
            animation: 0.75s steps(12) 0s infinite normal none running loading-spinner;
        }
        @keyframes loading-spinner {
            100% {
                transform: rotate(360deg);
            }
        }
        .loading-spinner polyline {
            stroke-width: 5px;
            stroke-linecap: round;
        }
        .loading-spinner polyline:nth-child(12n + 0) {    stroke-opacity: 0.08;  }  .loading-spinner polyline:nth-child(12n + 1) {    stroke-opacity: 0.17;  }  .loading-spinner polyline:nth-child(12n + 2) {    stroke-opacity: 0.25;  }  .loading-spinner polyline:nth-child(12n + 3) {    stroke-opacity: 0.33;  }  .loading-spinner polyline:nth-child(12n + 4) {    stroke-opacity: 0.42;  }  .loading-spinner polyline:nth-child(12n + 5) {    stroke-opacity: 0.5;  }  .loading-spinner polyline:nth-child(12n + 6) {    stroke-opacity: 0.58;  }  .loading-spinner polyline:nth-child(12n + 7) {    stroke-opacity: 0.66;  }  .loading-spinner polyline:nth-child(12n + 8) {    stroke-opacity: 0.75;  }  .loading-spinner polyline:nth-child(12n + 9) {    stroke-opacity: 0.83;  }  .loading-spinner polyline:nth-child(12n + 11) {    stroke-opacity: 0.92;  }"], ["  stroke-width: ", "px;  stroke-linecap: round;  .loading-spinner polyline:nth-child(12n + 0) {    stroke-opacity: 0.08;  }  .loading-spinner polyline:nth-child(12n + 1) {    stroke-opacity: 0.17;  }  .loading-spinner polyline:nth-child(12n + 2) {    stroke-opacity: 0.25;  }  .loading-spinner polyline:nth-child(12n + 3) {    stroke-opacity: 0.33;  }  .loading-spinner polyline:nth-child(12n + 4) {    stroke-opacity: 0.42;  }  .loading-spinner polyline:nth-child(12n + 5) {    stroke-opacity: 0.5;  }  .loading-spinner polyline:nth-child(12n + 6) {    stroke-opacity: 0.58;  }  .loading-spinner polyline:nth-child(12n + 7) {    stroke-opacity: 0.66;  }  .loading-spinner polyline:nth-child(12n + 8) {    stroke-opacity: 0.75;  }  .loading-spinner polyline:nth-child(12n + 9) {    stroke-opacity: 0.83;  }  .loading-spinner polyline:nth-child(12n + 11) {    stroke-opacity: 0.92;  }`}
      </style>
    </div>
  );
}
