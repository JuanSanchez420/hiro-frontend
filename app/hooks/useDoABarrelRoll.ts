import { useState, useEffect } from 'react';

const useDoABarrelRoll = () => {
  const [rotationCount, setRotationCount] = useState(0);

  useEffect(() => {
    document.body.style.transition = 'transform 1s ease';
    document.body.style.transform = `rotate(${rotationCount * 360}deg)`;
  }, [rotationCount]);

    const doABarrelRoll = () => {
        setRotationCount(rotationCount + 1);
    };
  
  return doABarrelRoll;
};

export default useDoABarrelRoll;