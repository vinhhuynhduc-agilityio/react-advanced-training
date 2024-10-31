import {
  render,
  screen,
  fireEvent
} from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  IconRenderer,
  IconRendererProps
} from "./StatusIcon";

const defaultProps: IconRendererProps = {
  value: false,
  onStatusValueChange: jest.fn(),
};

// Utility function to render component
const renderComponent = (props = defaultProps) =>
  render(<IconRenderer {...props} />);

describe("IconRenderer Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render FaClock icon when isComplete is false", () => {
    renderComponent();
    const iconElement = screen.getByTestId("icon-clock");

    expect(iconElement).toBeInTheDocument();
  });

  it("should render FaCheckCircle icon when isComplete is true", () => {
    renderComponent({ ...defaultProps, value: true });
    const iconElement = screen.getByTestId("icon-check");

    expect(iconElement).toBeInTheDocument();
  });

  it("should call onStatusValueChange when the icon is clicked", () => {
    renderComponent();
    const iconContainer = screen.getByTestId("icon-clock");

    fireEvent.click(iconContainer);
    expect(defaultProps.onStatusValueChange).toHaveBeenCalledTimes(1);
  });
});
