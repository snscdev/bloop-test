'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type VerifiedModalProps = {
  open: boolean;
  onClose: () => void;
};

const cardData = [
  {
    number: '1',
    title: 'Revisado por expertos',
    description:
      'Cada equipo pasa por pruebas técnicas rigurosas hechas por profesionales certificados.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="86"
        height="96"
        viewBox="0 0 86 96"
        fill="none"
      >
        <path
          d="M70.4113 10.4316C70.137 10.463 69.94 10.7109 69.9714 10.9852L70.4828 15.4561C70.5142 15.7304 70.7621 15.9274 71.0364 15.896C71.3108 15.8646 71.5077 15.6168 71.4763 15.3424L71.0217 11.3683L74.9958 10.9137C75.2702 10.8823 75.4671 10.6345 75.4357 10.3601C75.4044 10.0858 75.1565 9.88881 74.8822 9.9202L70.4113 10.4316ZM84.4855 33.7138L84.9751 33.6126C83.0916 24.4956 78.0676 16.329 70.7792 10.537L70.4681 10.9284L70.1571 11.3198C77.262 16.9662 82.1597 24.9273 83.9958 33.8149L84.4855 33.7138Z"
          fill="#597391"
        />
        <path
          d="M20.0503 12.0445L20.3798 12.4206L20.0503 12.0445ZM6.74165 35.7726C6.9043 35.9957 7.21706 36.0448 7.44022 35.8821L11.0768 33.2317C11.3 33.069 11.3491 32.7563 11.1864 32.5331C11.0238 32.3099 10.711 32.2609 10.4878 32.4235L7.25529 34.7795L4.89933 31.5469C4.73668 31.3238 4.42392 31.2747 4.20076 31.4374C3.9776 31.6 3.92854 31.9128 4.09119 32.1359L6.74165 35.7726ZM44.9737 2.32444L44.9617 1.82459C35.6548 2.04864 26.7219 5.53247 19.7207 11.6685L20.0503 12.0445L20.3798 12.4206C27.2049 6.43889 35.913 3.04272 44.9857 2.8243L44.9737 2.32444ZM20.0503 12.0445L19.7207 11.6685C12.7196 17.8046 8.09437 26.2035 6.65176 35.4006L7.14572 35.4781L7.63968 35.5555C9.04599 26.5898 13.5548 18.4022 20.3798 12.4206L20.0503 12.0445Z"
          fill="#597391"
        />
        <path
          d="M28.3046 76.6299L28.0801 77.0767L28.3046 76.6299ZM54.8711 79.7732L54.7571 79.2864L54.8711 79.7732ZM77.7752 65.0921C77.7366 64.8186 77.4837 64.6282 77.2102 64.6668L72.7544 65.2956C72.481 65.3342 72.2906 65.5871 72.3292 65.8606C72.3677 66.134 72.6207 66.3244 72.8941 66.2858L76.8549 65.7269L77.4138 69.6876C77.4524 69.9611 77.7053 70.1515 77.9787 70.1129C78.2522 70.0743 78.4426 69.8213 78.404 69.5479L77.7752 65.0921ZM9.92407 57.1925L9.46544 57.3916C13.1735 65.9308 19.7614 72.8975 28.0801 77.0767L28.3046 76.6299L28.5291 76.1832C20.4196 72.1091 13.9975 65.3177 10.3827 56.9933L9.92407 57.1925ZM28.3046 76.6299L28.0801 77.0767C36.3989 81.256 45.9207 82.3826 54.9851 80.2601L54.8711 79.7732L54.7571 79.2864C45.9208 81.3555 36.6385 80.2572 28.5291 76.1832L28.3046 76.6299ZM54.8711 79.7732L54.9851 80.2601C64.0494 78.1376 72.0811 72.9007 77.6796 65.4626L77.2801 65.1619L76.8806 64.8612C71.423 72.1122 63.5934 77.2173 54.7571 79.2864L54.8711 79.7732Z"
          fill="#597391"
        />
        <circle
          cx="45.4199"
          cy="41.0595"
          r="27.2736"
          transform="rotate(68.0335 45.4199 41.0595)"
          stroke="#597391"
          strokeDasharray="2 2"
        />
        <circle cx="45.3515" cy="40.9921" r="12.0263" fill="#597391" />
      </svg>
    ),
  },
  {
    number: '2',
    title: '100% funcional',
    description: 'Restaurado, actualizado y listo para usar como nuevo.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="98"
        height="72"
        viewBox="0 0 98 72"
        fill="none"
      >
        <path d="M57.1526 0.422365L0.935059 35.9963L57.1526 71.5703" stroke="#597391" />
        <ellipse cx="41.5369" cy="34.2849" rx="3.1232" ry="3.42311" fill="#597391" />
        <path
          d="M59.0261 0.553711C63.6481 0.553711 67.9706 4.34986 71.1667 10.8027C74.3474 17.2244 76.3288 26.131 76.3289 35.9961C76.3289 45.8611 74.3473 54.7678 71.1667 61.1895C67.9706 67.6424 63.6482 71.4395 59.0261 71.4395C54.4043 71.4392 50.0825 67.6422 46.8865 61.1895C43.7059 54.7678 41.7244 45.8611 41.7244 35.9961C41.7244 26.131 43.7059 17.2244 46.8865 10.8027C50.0825 4.35009 54.4043 0.553965 59.0261 0.553711Z"
          stroke="#597391"
        />
        <line
          y1="-0.5"
          x2="56.574"
          y2="-0.5"
          transform="matrix(0.861206 -0.508256 0.440945 0.897534 42.1611 34.9692)"
          stroke="#597391"
          strokeDasharray="2 2"
        />
        <line
          x1="42.1611"
          y1="34.4692"
          x2="97.4972"
          y2="34.4692"
          stroke="#597391"
          strokeDasharray="2 2"
        />
        <line
          y1="-0.5"
          x2="56.574"
          y2="-0.5"
          transform="matrix(0.861206 0.508256 -0.440945 0.897534 42.1611 34.9692)"
          stroke="#597391"
          strokeDasharray="2 2"
        />
      </svg>
    ),
  },
  {
    number: '3',
    title: 'Garantía incluida',
    description: 'Tu compra está protegida con garantía Bloop, igual que un equipo nuevo.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="95"
        height="95"
        viewBox="0 0 95 95"
        fill="none"
      >
        <circle
          cx="48.1444"
          cy="47.9859"
          r="25.6834"
          transform="rotate(68.0335 48.1444 47.9859)"
          stroke="#597391"
          strokeDasharray="2 2"
        />
        <line
          x1="14.4267"
          y1="13.5556"
          x2="81.5947"
          y2="80.7237"
          stroke="#597391"
          strokeDasharray="2 2"
        />
        <line x1="29.7977" y1="3.48146" x2="66.4371" y2="91.1208" stroke="#597391" />
        <line x1="66.5522" y1="3.91866" x2="29.6856" y2="91.4627" stroke="#597391" />
        <line x1="91.9892" y1="30.4516" x2="3.69283" y2="65.4779" stroke="#597391" />
        <line x1="90.8795" y1="67.1901" x2="4.02617" y2="28.7245" stroke="#597391" />
        <line
          x1="48.1568"
          y1="2.18557e-08"
          x2="48.1568"
          y2="94.99"
          stroke="#597391"
          strokeDasharray="2 2"
        />
        <line
          x1="94.99"
          y1="47.0332"
          x2="-4.37114e-08"
          y2="47.0332"
          stroke="#597391"
          strokeDasharray="2 2"
        />
        <line
          x1="13.713"
          y1="80.7231"
          x2="80.881"
          y2="13.555"
          stroke="#597391"
          strokeDasharray="2 2"
        />
      </svg>
    ),
  },
  {
    number: '4',
    title: 'Ahorro inteligente',
    description:
      'Paga menos por la misma calidad y ayuda al planeta al extender la vida útil del dispositivo.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="77"
        height="84"
        viewBox="0 0 77 84"
        fill="none"
      >
        <path
          d="M43.0197 5.11475C50.6949 7.59653 54.8327 15.6554 52.2912 23.1C49.7495 30.5443 41.4793 34.5907 33.804 32.1095C26.1286 29.6279 21.99 21.5694 24.5312 14.1248C27.0728 6.68008 35.3441 2.63314 43.0197 5.11475Z"
          stroke="#597391"
        />
        <path
          d="M61.7561 27.3613C69.4313 29.8431 73.5691 37.902 71.0276 45.3466C68.4859 52.7909 60.2157 56.8373 52.5404 54.356C44.865 51.8745 40.7264 43.816 43.2676 36.3714C45.8092 28.9267 54.0805 24.8797 61.7561 27.3613Z"
          stroke="#597391"
        />
        <path
          d="M23.7414 26.8765C31.4166 29.3582 35.5544 37.4171 33.0129 44.8617C30.4713 52.306 22.201 56.3524 14.5258 53.8712C6.85038 51.3896 2.71175 43.3312 5.25298 35.8865C7.79452 28.4418 16.0659 24.3949 23.7414 26.8765Z"
          stroke="#597391"
        />
        <path
          d="M42.1519 48.6392C49.8271 51.1209 53.9649 59.1798 51.4234 66.6244C48.8818 74.0687 40.6115 78.1151 32.9362 75.6339C25.2609 73.1523 21.1222 65.0938 23.6635 57.6492C26.205 50.2045 34.4764 46.1576 42.1519 48.6392Z"
          stroke="#597391"
        />
        <line
          x1="52.801"
          y1="1.28027"
          x2="52.801"
          y2="81.9279"
          stroke="#597391"
          strokeDasharray="2 2"
        />
        <line
          x1="74.9794"
          y1="26.1021"
          x2="1.31617"
          y2="26.102"
          stroke="#597391"
          strokeDasharray="2 2"
        />
        <line
          x1="74.9786"
          y1="55.2646"
          x2="-4.49165e-08"
          y2="55.2646"
          stroke="#597391"
          strokeDasharray="2 2"
        />
        <line
          x1="23.1753"
          y1="83.2075"
          x2="23.1753"
          y2="2.55985"
          stroke="#597391"
          strokeDasharray="2 2"
        />
      </svg>
    ),
  },
];

export function VerifiedModal({ open, onClose }: VerifiedModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          padding: '51px 28px 18px 28px',
          bgcolor: '#FAFAFA',
        },
      }}
    >
      {/* Botón de cerrar */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          zIndex: 1,
          color: 'white',
        }}
      >
        <Iconify icon="mdi:close" width={24} color="#597391" />
      </IconButton>

      {/* Banner superior */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '150px', md: '194px' },
          borderRadius: '18px',
          overflow: 'hidden',
        }}
      >
        {/* Gradiente de fondo (capa base) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #7F9CB5 0%, #98B1C6 100%)',
            zIndex: 0,
          }}
        />

        {/* Imagen de fondo del lado izquierdo */}
        <Box
          component="img"
          src="/assets/background/banner/verificado.png"
          alt="verificado background"
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            height: '120%',
            width: 'auto',
            objectFit: 'cover',
            zIndex: 1,
            opacity: 0.9,
          }}
        />

        {/* Gradient Blur Overlay (de abajo hacia arriba - más blur arriba) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(3px)',
            maskImage:
              'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,1) 100%)',
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,1) 100%)',
            zIndex: 2,
          }}
        />

        {/* Contenido del banner (por encima de todo) */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            px: 3,
          }}
        >
          <Box
            sx={{
              padding: '11px',
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.20)',
              backdropFilter: 'blur(13.449999809265137px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M22.1337 9.1568C21.7361 8.74125 21.3247 8.31305 21.1697 7.93652C21.0263 7.59164 21.0178 7.02 21.0094 6.46629C20.9936 5.43691 20.9767 4.27043 20.1656 3.45937C19.3546 2.64832 18.1881 2.63145 17.1587 2.61562C16.605 2.60719 16.0334 2.59875 15.6885 2.45531C15.313 2.30027 14.8837 1.88895 14.4682 1.49133C13.7405 0.79207 12.9136 0 11.8125 0C10.7114 0 9.88559 0.79207 9.1568 1.49133C8.74125 1.88895 8.31305 2.30027 7.93652 2.45531C7.59375 2.59875 7.02 2.60719 6.46629 2.61562C5.43691 2.63145 4.27043 2.64832 3.45937 3.45937C2.64832 4.27043 2.63672 5.43691 2.61562 6.46629C2.60719 7.02 2.59875 7.59164 2.45531 7.93652C2.30027 8.31199 1.88895 8.74125 1.49133 9.1568C0.79207 9.88453 0 10.7114 0 11.8125C0 12.9136 0.79207 13.7394 1.49133 14.4682C1.88895 14.8837 2.30027 15.312 2.45531 15.6885C2.59875 16.0334 2.60719 16.605 2.61562 17.1587C2.63145 18.1881 2.64832 19.3546 3.45937 20.1656C4.27043 20.9767 5.43691 20.9936 6.46629 21.0094C7.02 21.0178 7.59164 21.0263 7.93652 21.1697C8.31199 21.3247 8.74125 21.7361 9.1568 22.1337C9.88453 22.8329 10.7114 23.625 11.8125 23.625C12.9136 23.625 13.7394 22.8329 14.4682 22.1337C14.8837 21.7361 15.312 21.3247 15.6885 21.1697C16.0334 21.0263 16.605 21.0178 17.1587 21.0094C18.1881 20.9936 19.3546 20.9767 20.1656 20.1656C20.9767 19.3546 20.9936 18.1881 21.0094 17.1587C21.0178 16.605 21.0263 16.0334 21.1697 15.6885C21.3247 15.313 21.7361 14.8837 22.1337 14.4682C22.8329 13.7405 23.625 12.9136 23.625 11.8125C23.625 10.7114 22.8329 9.88559 22.1337 9.1568ZM16.6282 9.8782L10.722 15.7845C10.6436 15.8629 10.5505 15.9251 10.4481 15.9676C10.3457 16.0101 10.2359 16.0319 10.125 16.0319C10.0141 16.0319 9.90432 16.0101 9.80189 15.9676C9.69946 15.9251 9.60641 15.8629 9.52805 15.7845L6.9968 13.2532C6.9184 13.1748 6.85622 13.0817 6.81379 12.9793C6.77137 12.8769 6.74953 12.7671 6.74953 12.6562C6.74953 12.5454 6.77137 12.4356 6.81379 12.3332C6.85622 12.2308 6.9184 12.1377 6.9968 12.0593C7.15512 11.901 7.36985 11.812 7.59375 11.812C7.70461 11.812 7.81439 11.8339 7.91682 11.8763C8.01924 11.9187 8.11231 11.9809 8.1907 12.0593L10.125 13.9946L15.4343 8.6843C15.5127 8.6059 15.6058 8.54372 15.7082 8.50129C15.8106 8.45887 15.9204 8.43703 16.0312 8.43703C16.1421 8.43703 16.2519 8.45887 16.3543 8.50129C16.4567 8.54372 16.5498 8.6059 16.6282 8.6843C16.7066 8.76269 16.7688 8.85576 16.8112 8.95818C16.8536 9.06061 16.8755 9.17039 16.8755 9.28125C16.8755 9.39211 16.8536 9.50189 16.8112 9.60432C16.7688 9.70674 16.7066 9.79981 16.6282 9.8782Z"
                fill="white"
              />
            </svg>
          </Box>
          <Typography
            sx={{
              color: 'white',
              fontSize: { xs: '32px', md: '40px' },
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Reacondicionado Verificado
          </Typography>
          <Typography
            sx={{
              color: 'white',
              fontSize: { xs: '14px', md: '16px' },
              textAlign: 'center',
            }}
          >
            Calidad garantizada, precio más bajo y sin sorpresas
          </Typography>
        </Box>
      </Box>

      {/* Grid de 4 cards */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: 'center',
          gap: 3,
          p: { xs: 3, md: 5 },
        }}
      >
        {cardData.map((card) => (
          <Card
            key={card.number}
            sx={{
              maxWidth: { xs: '100%', md: '300px' },
              width: '100%',
              height: { xs: 'auto', md: '356px' },
              padding: { xs: '20px 15px', md: '24px 17px' },
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 3, md: '110px' },
              position: 'relative',
              borderRadius: '18px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Header con ícono y número */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              {/* Ícono esquina superior izquierda */}
              <Box
                sx={{
                  width: { xs: '60px', md: '80px' },
                  height: { xs: '60px', md: '80px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </Box>

              {/* Número esquina superior derecha */}
              <Typography
                sx={{
                  fontSize: { xs: '40px', md: '48px' },
                  fontWeight: 300,
                  color: '#597391',
                  lineHeight: 1,
                }}
              >
                {card.number}
              </Typography>
            </Box>

            {/* Contenido inferior */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                sx={{
                  fontSize: { xs: '18px', md: '20px' },
                  fontWeight: 600,
                  color: '#597391',
                }}
              >
                {card.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '14px', md: '16px' },
                  color: '#597391',
                  lineHeight: 1.5,
                }}
              >
                {card.description}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
    </Dialog>
  );
}
