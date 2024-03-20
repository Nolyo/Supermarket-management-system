// useInsights.js
import { useState, useEffect } from 'react';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import config from '../../../ai.config.js';

export default function useInsights() {
  const [appInsights, setAppInsights] = useState(null);

  useEffect(() => {
    const ai = new ApplicationInsights(config);
    ai.loadAppInsights();
    setAppInsights(ai);
  }, []);

  return appInsights;
}
