interface ComingSoonProps {
  page: string;
}

const ComingSoon = ({ page }: ComingSoonProps) => {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{page}</h1>
        <p className="text-gray-400 text-xl">Coming Soon</p>
      </div>
    </div>
  );
};

export default ComingSoon;
