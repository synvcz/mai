import { useEffect, useState, type ComponentType } from "react";
import { modules as discoveredModules } from "./.generated/mockup-components";

type ModuleMap = Record<string, () => Promise<Record<string, unknown>>>;

function resolveComponent(
  mod: Record<string, unknown>,
  name: string,
): ComponentType | undefined {
  const fns = Object.values(mod).filter(
    (v) => typeof v === "function",
  ) as ComponentType[];

  return (
    (mod.default as ComponentType) ||
    (mod.Preview as ComponentType) ||
    (mod[name] as ComponentType) ||
    fns[fns.length - 1]
  );
}

function Character01() {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loader =
      discoveredModules[
        "./components/mockups/character-01/Character01.tsx"
      ];

    if (!loader) {
      setError("Character01 component could not be found.");
      return;
    }

    loader()
      .then((mod) => {
        const component = resolveComponent(mod, "Character01");

        if (!component) {
          setError("Character01 component could not be resolved.");
          return;
        }

        setComponent(() => component);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : String(err),
        );
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-2">
            Component Error
          </h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <Component />;
}

function PreviewRenderer({
  componentPath,
  modules,
}: {
  componentPath: string;
  modules: ModuleMap;
}) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const key = `./components/mockups/${componentPath}.tsx`;
    const loader = modules[key];

    if (!loader) {
      setError(`Component not found: ${componentPath}`);
      return;
    }

    loader()
      .then((mod) => {
        if (cancelled) return;

        const name = componentPath.split("/").pop()!;
        const component = resolveComponent(mod, name);

        if (!component) {
          setError(`Could not resolve component: ${name}`);
          return;
        }

        setComponent(() => component);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : String(err),
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [componentPath, modules]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-2">
            Preview Error
          </h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <Component />;
}

function getPreviewPath(): string | null {
  const { pathname } = window.location;
  const match = pathname.match(/^\/preview\/(.+)$/);

  return match ? match[1] : null;
}

function App() {
  const previewPath = getPreviewPath();

  if (previewPath) {
    return (
      <PreviewRenderer
        componentPath={previewPath}
        modules={discoveredModules}
      />
    );
  }

  return <Character01 />;
}

export default App;
