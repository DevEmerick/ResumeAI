import { render, screen } from "@testing-library/react";
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }));
// FeatureCard component has been removed, hence the tests related to it are also removed.
