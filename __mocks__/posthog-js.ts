// Applied automatically to every test: the real SDK never loads or sends anything.
const posthog = {
  init: jest.fn(),
  capture: jest.fn(),
};

export default posthog;
