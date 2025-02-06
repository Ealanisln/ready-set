import * as React from "react"

const VisuallyHidden: React.FC<{ children?: React.ReactNode; asChild?: boolean; style?: React.CSSProperties }> = ({ children, asChild = false, ...props }) => {
  const Comp = asChild ? React.Fragment : "span"
  return (
    <Comp
      {...props}
      style={{
        position: "absolute",
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        wordWrap: "normal",
        ...props.style,
      }}
    >
      {children}
    </Comp>
  )
}

export { VisuallyHidden }