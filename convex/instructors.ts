export const INSTRUCTORS = [
  { firstName: "Federico", lastName: "PROIETTI" },
  { firstName: "Enrico", lastName: "SCALINI" },
  { firstName: "Alessio", lastName: "MARGIOTTA" },
  { firstName: "Daniele", lastName: "CARUSO" },
  { firstName: "Sandro", lastName: "ANDREOTTI" },
  { firstName: "Nicolò", lastName: "GARDONI" },
  { firstName: "Martin", lastName: "ĎUROVEC" },
  { firstName: "Luca", lastName: "GIOVANNINI" },
  { firstName: "Laura", lastName: "GIULIANI" },
  { firstName: "Edoardo", lastName: "GIRALDO" },
  { firstName: "Dennis", lastName: "CASTIONI" },
  { firstName: "Pierandrea", lastName: "ROTONDI" },
  { firstName: "Chiara", lastName: "FERRERO" },
  { firstName: "Federico", lastName: "GRANDI" },
] as const;

export function formatInstructorName(instructor: (typeof INSTRUCTORS)[number]) {
  return `${instructor.firstName} ${instructor.lastName}`;
}

export const INSTRUCTOR_NAMES = INSTRUCTORS.map(formatInstructorName);

export function isValidInstructorName(name: string) {
  return INSTRUCTOR_NAMES.includes(
    name as (typeof INSTRUCTOR_NAMES)[number],
  );
}
