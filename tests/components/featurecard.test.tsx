import { render, screen } from "@testing-library/react";
import FeatureCard from "@/components/FeatureCard";
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }));

test("FeatureCard renders and has Try this feature button", () => {
  render(<FeatureCard title="Test" description="desc" icon={<span>icon</span>} details="details" />);
  expect(screen.getByText(/Try this feature/i)).toBeInTheDocument();
});
