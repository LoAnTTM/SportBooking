import { useEffect, useState } from 'react';

import { getData, storeData } from '@/helpers/storage';

const FIRST_LAUNCH_KEY = 'isFirstLaunch';

const useFirstLaunch = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const isFirstLaunchStored = await getData(FIRST_LAUNCH_KEY);
      if (isFirstLaunchStored === null) {
        setIsFirstLaunch(true);
        await storeData(FIRST_LAUNCH_KEY, 'false');
      } else {
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  return isFirstLaunch;
};

export default useFirstLaunch;
