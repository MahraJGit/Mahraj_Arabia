export type DeliveryStep = {
  number: string;
  title: string;
  description: string;
};

export const deliveryApproach = {
  eyebrow: "A connected process",
  title: "From requirements to installation.",
  description:
    "Our experienced team develops practical designs, delivers quality fabrication and coordinates reliable installation tailored to each project.",
  steps: [
    {
      number: "01",
      title: "Understand",
      description: "Clarify the purpose, site and project requirements.",
    },
    {
      number: "02",
      title: "Configure",
      description: "Shape a practical solution around the brief.",
    },
    {
      number: "03",
      title: "Fabricate",
      description: "Deliver quality fabrication for the agreed scope.",
    },
    {
      number: "04",
      title: "Install",
      description: "Coordinate reliable installation for the project.",
    },
  ] satisfies DeliveryStep[],
};

export const aboutPromise =
  "Mahraj Arabia supports construction, industrial, commercial and event clients with portable buildings, modular spaces, fencing systems and fabricated steelwork. Our work begins with how the solution will be used—people, access, utilities, movement, maintenance and programme—before shaping the scope.";
