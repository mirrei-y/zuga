import { Kind } from "../kind";

export type Props<K extends Kind> = {
  rectangle: {
    color: string;
    strokeColor: string;
    strokeWidth: number;
    label?: string;
    labelColor?: string;
    labelSize?: number;
    labelPlacement?: "center" | "top" | "bottom" | "left" | "right";
  };
  ellipse: {
    color: string;
    strokeColor: string;
    strokeWidth: number;
    label?: string;
    labelColor?: string;
    labelSize?: number;
    labelPlacement?: "center" | "top" | "bottom" | "left" | "right";
  };
  line: {
    color: string;
    strokeWidth: number;
    arrowStart?: boolean;
    arrowEnd?: boolean;
  };
  text: {
    content: string;
    fontSize: number;
    color: string;
  };
  resistor: {
    color: string;
    strokeWidth: number;
    label?: string;
    labelColor?: string;
    labelSize?: number;
    labelPlacement?: "center" | "top" | "bottom" | "left" | "right";
  };
  capacitor: {
    color: string;
    strokeWidth: number;
    label?: string;
    labelColor?: string;
    labelSize?: number;
    labelPlacement?: "center" | "top" | "bottom" | "left" | "right";
  };
  inductor: {
    color: string;
    strokeWidth: number;
    label?: string;
    labelColor?: string;
    labelSize?: number;
    labelPlacement?: "center" | "top" | "bottom" | "left" | "right";
  };
  source: {
    color: string;
    strokeWidth: number;
    label?: string;
    labelColor?: string;
    labelSize?: number;
    labelPlacement?: "center" | "top" | "bottom" | "left" | "right";
  };
  gnd: {
    color: string;
    strokeWidth: number;
    label?: string;
    labelColor?: string;
    labelSize?: number;
    labelPlacement?: "center" | "top" | "bottom" | "left" | "right";
  };
  math: {
    content: string;
  };
  polygon: {
    color: string;
    strokeColor: string;
    strokeWidth: number;
    label?: string;
    labelColor?: string;
    labelSize?: number;
    labelPlacement?: "center" | "top" | "bottom" | "left" | "right";
  };
}[K];

export const defaultProps: { [K in Kind]: Props<K> } = {
  rectangle: {
    color: "transparent",
    strokeColor: "#000000",
    strokeWidth: 2,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "center",
  },
  ellipse: {
    color: "transparent",
    strokeColor: "#000000",
    strokeWidth: 2,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "center",
  },
  polygon: {
    color: "transparent",
    strokeColor: "#000000",
    strokeWidth: 2,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "center",
  },
  line: {
    color: "#000000",
    strokeWidth: 2,
    arrowStart: false,
    arrowEnd: false,
  },
  text: {
    content: "Text",
    fontSize: 16,
    color: "#000000",
  },
  resistor: {
    color: "#000000",
    strokeWidth: 2,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "top",
  },
  capacitor: {
    color: "#000000",
    strokeWidth: 2,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "top",
  },
  inductor: {
    color: "#000000",
    strokeWidth: 2,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "top",
  },
  source: {
    color: "#000000",
    strokeWidth: 2,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "top",
  },
  gnd: {
    color: "#000000",
    strokeWidth: 2,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "top",
  },
  math: {
    content: "X"
  }
};
