import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Servicio Técnico - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ servicio: string; id: string }>;
};

export default async function ReparacionPage({ params }: Props) {
  const { servicio, id } = await params;

  // TODO: Aquí se hará la llamada al backend para obtener los datos del servicio técnico
  // const servicioData = await fetchServicio(servicio, id);

  return (
    <Container sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Inicio
        </Link>
        <Link underline="hover" color="inherit" href="/reparar">
          Reparar
        </Link>
        <Typography color="text.primary">{servicio}</Typography>
      </Breadcrumbs>

      <Card>
        <CardContent>
          <Typography variant="h3" gutterBottom>
            Servicio Técnico en Desarrollo
          </Typography>

          <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
            Los servicios técnicos solo permiten agregar uno por compra para mantener claridad en el
            proceso.
          </Alert>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <strong>Servicio:</strong> {servicio}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <strong>ID:</strong> {id}
            </Typography>
          </Box>

          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.neutral', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Esta página mostrará los detalles completos del servicio técnico una vez que el
              backend esté listo. La ruta está preparada para recibir y procesar los parámetros de
              servicio e ID.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
