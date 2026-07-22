import React, { useEffect } from 'react';
import RentSpace from '../components/RentSpace';

export default function EventsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return <RentSpace />;
}
