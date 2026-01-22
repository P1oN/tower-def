import { act } from "react";
import { createRoot } from "react-dom/client";
import Game from "./Game";

beforeAll(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
    true;
});

afterAll(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
    false;
});

const renderGame = () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => {
    root.render(<Game />);
  });
  return { container, root };
};

const findByText = (container: HTMLElement, text: string) =>
  Array.from(container.querySelectorAll("*")).find(
    (element) => element.textContent === text,
  );

describe("Game integration", () => {
  it("advances one step and updates the UI", () => {
    const { container, root } = renderGame();

    expect(findByText(container, "1 updates")).toBeTruthy();
    expect(findByText(container, "3 active")).toBeTruthy();

    const nextButton = findByText(container, "Next step");
    expect(nextButton).toBeTruthy();

    act(() => {
      nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(findByText(container, "2 updates")).toBeTruthy();
    expect(findByText(container, "2 active")).toBeTruthy();

    act(() => {
      root.unmount();
    });
  });
});
