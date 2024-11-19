import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock Dashboard component
jest.mock("./pages/Dashboard/Dashboard", () => ({
  ...jest.requireActual("./pages/Dashboard/Dashboard"),
  default: () => <div data-testid="dashboard-component">Mocked Dashboard</div>,
}));

describe("App Component", () => {
  it("matches snapshot for App", () => {
    const { container } = render(<App />);

    expect(container).toMatchSnapshot();
  });
});
