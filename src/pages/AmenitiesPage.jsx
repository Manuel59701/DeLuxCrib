import React, { useEffect } from 'react';
import WhatWeOffer from '../components/WhatWeOffer';

export default function AmenitiesPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return <WhatWeOffer />;
}
