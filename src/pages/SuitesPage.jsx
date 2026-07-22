import React, { useEffect } from 'react';
import RoomBooking from '../components/RoomBooking';

export default function SuitesPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return <RoomBooking />;
}
