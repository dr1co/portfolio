import type { Scenario } from "@/content/lab-pipeline";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";

/** Native radio group styled as a segmented control; the browser provides arrow-key behaviour. */
export function ScenarioPicker({
  scenarios,
  selected,
  onSelect,
  locale,
}: {
  scenarios: readonly Scenario[];
  selected: Scenario["id"];
  onSelect: (id: Scenario["id"]) => void;
  locale: Locale;
}) {
  return (
    <fieldset>
      <legend className="font-mono text-sm text-muted">
        {getMessages(locale).explorer.scenario}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {scenarios.map((scenario) => (
          <label
            key={scenario.id}
            className="cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground has-[:checked]:border-accent has-[:checked]:bg-surface-elevated has-[:checked]:font-semibold has-[:checked]:text-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
          >
            <input
              type="radio"
              name="pipeline-scenario"
              value={scenario.id}
              checked={scenario.id === selected}
              onChange={() => onSelect(scenario.id)}
              className="sr-only"
            />
            {scenario.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
