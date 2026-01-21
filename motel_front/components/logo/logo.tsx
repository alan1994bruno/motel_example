export function Logo() {
  return (
    <div className="relative group">
      <h1
        className="text-4xl font-extrabold text-[#4c1d95] -rotate-6 tracking-tighter italic"
        style={{ fontFamily: "sans-serif" }}
      >
        Motel
      </h1>
      <div className="h-1 w-full bg-[#4c1d95] mt-1 rounded-full"></div>
      <div className="h-0.5 w-3/4 bg-[#4c1d95] mt-0.5 rounded-full ml-auto"></div>
    </div>
  );
}
