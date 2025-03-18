'use client'

import React, { useEffect, useMemo } from "react";
import tokens from "../utils/tokens.json";
import { useGlobalContext } from "../context/GlobalContext";

const RainingIcon: React.FC = () => {
  const [loaded, setLoaded] = React.useState(false);
  const { rain, setRain } = useGlobalContext();
  const count = 30;

  const token = tokens[rain?.toUpperCase() as keyof typeof tokens];

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (rain) setTimeout(() => setRain(undefined), 10_000);
  }, [rain, setRain])

  const icons = useMemo(() => Array.from({ length: count }, (_, i) => {
    const leftPosition = Math.random() * 80;
    return (
      <div key={i} className="falling-icon" style={{ left: `${leftPosition}vw` }}>
        <img src={token?.logoURI} className="size-8" alt="" />
      </div>
    );
  }), [token?.logoURI, count]);

  return loaded && token?.logoURI ? <div>{icons}</div> : null;
}

export default React.memo(RainingIcon);