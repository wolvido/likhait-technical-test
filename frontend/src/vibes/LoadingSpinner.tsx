/**
 * Loading spinner component
 */

import React from "react";

interface LoadingSpinnerProps {
  size?: number;
}

export function LoadingSpinner({ size = 40 }: LoadingSpinnerProps) {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  };

  const spinnerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle}></div>
    </div>
  );
}
