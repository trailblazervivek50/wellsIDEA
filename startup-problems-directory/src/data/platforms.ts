export interface Platform {
  id: string;
  name: string;
  description: string;
  url: string;
  color: 'yellow' | 'blue' | 'pink' | 'cream';
  rotation: number;
}

export const platforms: Platform[] = [
  {
    id: "01",
    name: "ProblemHunt",
    description: "Discover startup problems rather than starting with a solution.",
    url: "https://problemhunt.org/",
    color: "yellow",
    rotation: -1,
  },
  {
    id: "02",
    name: "Problem Sight",
    description: "Explore community-shared customer pain points and startup ideas.",
    url: "https://problemsight.com/",
    color: "blue",
    rotation: 1,
  },
  {
    id: "03",
    name: "World's Backlog",
    description: "Explore frustrations and workflow problems worth investigating.",
    url: "https://worldsbacklog.com/",
    color: "pink",
    rotation: -1.5,
  },
  {
    id: "04",
    name: "IdeaSift",
    description: "Discover recurring problems from public discussions and communities.",
    url: "https://ideasift.io/",
    color: "cream",
    rotation: 1,
  },
  {
    id: "05",
    name: "Needgap",
    description: "Browse needs and problems shared by people looking for solutions.",
    url: "https://needgap.com/",
    color: "yellow",
    rotation: -1,
  },
  {
    id: "06",
    name: "Biz Ideas AI",
    description: "Explore complaints, pain points and potential business opportunities.",
    url: "https://bizideas.ai/",
    color: "blue",
    rotation: 1.5,
  },
  {
    id: "07",
    name: "ProblemHunt Reddit",
    description: "Discover recurring problems from Reddit discussions.",
    url: "https://getproblemhunt.com/",
    color: "pink",
    rotation: -1,
  }
];
