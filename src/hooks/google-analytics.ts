import { useEffect, useRef } from 'react';
import ReactGA from 'react-ga4';

type useGoogleAnalyticsFunction = (title: string, hitType?: string, page?: string) => void;

const useGoogleAnalytics: useGoogleAnalyticsFunction = (title, hitType = 'pageview', page?): void => {
  const pageRef = useRef(page);

  useEffect(() => {
    if (pageRef.current === undefined) {
      pageRef.current = (window.location.hash).replace('#', '');
    }
    else if (pageRef.current == '') {
      pageRef.current = window.location.pathname;
    }
   
    if (window.location.host == 'chunkycheesy.github.io') {
      ReactGA.send({ hitType: hitType, page: pageRef.current, title: title });
    }
  }, []);
}

export default useGoogleAnalytics;