import { notFound } from 'next/navigation';

import { getAccessoryById } from 'src/services/accessory-service';

import { AccessoryDetailView } from './components/accessory-detail-view';

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AccesorioPage({ params }: Props) {
  const { id } = await params;
  const accessory = await getAccessoryById(id);

  if (!accessory) {
    notFound();
  }

  return <AccessoryDetailView accessory={accessory} />;
}
