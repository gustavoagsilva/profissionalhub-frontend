const paths = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  calendar:
    "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2 M16 3v4 M8 3v4 M3 11h18 M8 15h2 M14 15h2",
  wallet: "M20 8V5H5a2 2 0 0 0 0 4h16v11H5a2 2 0 0 1-2-2V7 M21 12h-5v5h5",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0 M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  arrow: "M4 12h16 M14 6l6 6-6 6",
  plus: "M12 5v14 M5 12h14",
  close: "M6 6l12 12 M6 18 18 6",
  check: "M5 12l4 4L19 6",
  clock: "M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  logout: "M9 5H4v14h5 M10 12h11 M17 8l4 4-4 4",
  chevron: "M9 5l7 7-7 7",
  repeat: "M4 10V5h13l3 3 M20 14v5H7l-3-3 M16 4l4 4-4 4 M8 12l-4 4 4 4",
  tree: "M12 2l7 8h-3l5 7H3l5-7H5z M12 17v5",
  building: "M4 21V3h12v18 M16 9h4v12 M8 7h4 M8 11h4 M8 15h4 M2 21h20",
  home: "M3 10l9-7 9 7 M5 9v12h14V9 M9 21v-8h6v8",
  mail: "M3 5h18v14H3z M3 5l9 7 9-7",
  lock: "M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  spark: "M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z",
  menu: "M4 6h16 M4 12h16 M4 18h16",
};
export default function Icon({ name, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.grid} />
    </svg>
  );
}
