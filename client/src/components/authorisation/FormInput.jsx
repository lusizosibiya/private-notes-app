import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function FormInput({
  id,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  autoComplete,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && isPasswordVisible ? "text" : type;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-semibold text-[#280A08]"
      >
        {label}{" "}
        <span aria-hidden="true" className="text-[#652423]">
          *
        </span>
      </label>
      <div className="flex h-11 items-center gap-3 rounded-xl border border-[#280A08]/15 bg-[#E4E1E1] px-4 transition focus-within:border-[#652423] focus-within:ring-2 focus-within:ring-[#652423]/15">
        <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#280A08]" />
        <input
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#280A08] outline-none placeholder:text-[#280A08]/55"
        />
        {isPassword && (
          <button
            type="button"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            className="shrink-0 text-[#280A08]/75 hover:text-[#280A08]"
          >
            {isPasswordVisible ? (
              <FiEyeOff aria-hidden="true" className="h-5 w-5" />
            ) : (
              <FiEye aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default FormInput;
