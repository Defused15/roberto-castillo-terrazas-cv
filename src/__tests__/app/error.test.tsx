import { act, screen, waitFor } from "@testing-library/react";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { TextEncoder } from "util";
import ErrorPage from "@/app/error";
import GlobalError from "@/app/global-error";
import { LANGS, RESUME_DATA_BY_LANG } from "@/data/resume-data";
import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { capturedEvents, startAnalytics } from "@/test/analytics";

describe("error page", () => {
  it.each(LANGS)("[%s] explains the error, retries and links back to the CV", async (lang) => {
    const { title, description, retry, backHome } = RESUME_DATA_BY_LANG[lang].ui.error;
    const reset = jest.fn();
    const { user, container } = renderWithProviders(<ErrorPage error={new Error("x")} reset={reset} />, { lang });
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: retry }));
    expect(reset).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: backHome })).toHaveAttribute("href", "/");
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("error page › analytics", () => {
  beforeEach(startAnalytics);

  it("sends app_error with the digest only", async () => {
    const error = Object.assign(new Error("secret@example.com"), { digest: "abc123" });
    renderWithProviders(<ErrorPage error={error} reset={jest.fn()} />);
    await waitFor(() => expect(capturedEvents()).toEqual([["app_error", { digest: "abc123" }]]));
  });

  it("sends nothing without a digest", async () => {
    renderWithProviders(<ErrorPage error={new Error("x")} reset={jest.fn()} />);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(capturedEvents()).toEqual([]);
  });
});

describe("global error", () => {
  // It replaces the root layout, so it renders its own <html>: checked as static
  // markup, and its retry button through the element tree it returns.
  it.each([
    ["es-ES", "es"],
    ["en-US", "en"],
  ] as const)("renders its own document in %s", (language, lang) => {
    jest.spyOn(navigator, "language", "get").mockReturnValue(language);
    const reset = jest.fn();
    const { title, retry, backHome } = RESUME_DATA_BY_LANG[lang].ui.error;
    // react-dom/server needs TextEncoder, which jsdom lacks; load it after the polyfill.
    Object.assign(globalThis, { TextEncoder });
    const { renderToStaticMarkup } = require("react-dom/server") as typeof import("react-dom/server");
    const html = renderToStaticMarkup(<GlobalError error={new Error("x")} reset={reset} />);
    expect(html).toContain(`<html lang="${lang}">`);
    expect(html).toContain(`>${title}</h1>`);
    expect(html).toContain(`>${retry}</button>`);
    expect(html).toContain(`href="/"`);
    expect(html).toContain(`>${backHome}</a>`);
  });

  it("calls reset from its retry button", () => {
    const reset = jest.fn();
    const tree = GlobalError({ error: new Error("x"), reset });
    const find = (node: ReactNode): ReactElement | undefined => {
      if (!isValidElement<{ children?: ReactNode }>(node)) return undefined;
      if (node.type === "button") return node;
      return Children.toArray(node.props.children).map(find).find(Boolean);
    };
    (find(tree)!.props as { onClick: () => void }).onClick();
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
