import type { HTMLAttributes } from "astro/types";
import type { VariantProps } from "tailwind-variants";
import type { button } from "./Button.variants";

export interface ButtonProps
  extends HTMLAttributes<"button">, Omit<HTMLAttributes<"a">, "type">, VariantProps<typeof button> {}

export type ButtonVariant = VariantProps<typeof button>["variant"];
export type ButtonSize = VariantProps<typeof button>["size"];
