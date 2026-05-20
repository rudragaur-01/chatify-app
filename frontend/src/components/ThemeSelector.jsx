import { PaletteIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle m-0">
        <PaletteIcon className="size-6 text-base-content opacity-70" />
      </label>

      <ul
        tabIndex={0}
        className="
          dropdown-content z-[1] mt-2 w-56
          max-h-80 overflow-y-auto
          rounded-2xl border border-base-content/10
          bg-base-200 p-1 shadow-2xl
        "
      >
        {THEMES.map((themeOption) => (
          <li key={themeOption.name}>
            <button
              className={`
                w-full px-4 py-3 rounded-xl
                flex items-center gap-3
                transition-colors
                ${
                  theme === themeOption.name
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-base-content/5"
                }
              `}
              onClick={() => {
                setTheme(themeOption.name);

                document.activeElement?.blur();
              }}
            >
              <PaletteIcon className="size-4" />

              <span className="text-sm font-medium">{themeOption.label}</span>

              <div className="ml-auto flex gap-1">
                {themeOption.colors.map((color, i) => (
                  <span
                    key={i}
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeSelector;
