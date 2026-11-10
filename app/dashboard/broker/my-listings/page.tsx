'use client';

import React from 'react';
import { BrokerListingsView } from '@/components/dashboard/broker/listings';

export default function BrokerMyListingsPage() {
  return <BrokerListingsView forcedTab="curated" />;
}
