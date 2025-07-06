import { tv } from "tailwind-variants";

const textField = tv({
  base: "flex flex-col gap-2"
});

const textFieldLabel = tv({
  base: "typography-xs",
  variants: {
    default: {
      true: "text-gray-500",
    },
    active: {
      true: "text-blue",
    },
    error: {
      true: "text-danger",
    },
  },
  defaultVariants: {
    default: true,
    active: false,
    error: false,
  }
});

const textFieldInput = tv({
  base: "w-full border rounded-lg p-4 typography-md placeholder:color-gray-400 h-12 text-gray-600 focus:border-[1.5px]",
  variants: {
    default: {
      true: "border-gray-300 outline-none focus:border-blue",
    },
    error: {
      true: "border-danger outline-none focus:border-danger"
    },
  },
  defaultVariants: {
    default: true,
    error: false,
  }
});

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string,
  name: string,
  default?: boolean,
  active?: boolean,
  error?: boolean,
}

export default function TextField({ id, className, label, active, error, ...props }: Props) {
  return <div className={textField({ className })}>
    {label && <label htmlFor={id} className={textFieldLabel({ error })}>{label}</label>}
    <input type="text" id={id} className={textFieldInput({ error })} {...props} />
  </div>
}
