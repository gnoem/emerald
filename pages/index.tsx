import React from "react";
import Link from "next/link";

const Home: React.FC = (): JSX.Element => {
  return (
    <div>
      <Link href="/game">visit game</Link>
    </div>
  );
}

export default Home;