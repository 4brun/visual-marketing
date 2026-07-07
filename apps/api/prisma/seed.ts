import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.infographicTemplate.createMany({
    data: [
      {
        name: 'Хит продаж',
        category: 'promo',
        svgData: '<svg viewBox="0 0 200 60"><rect fill="#ff4444" rx="8" width="200" height="60"/><text x="100" y="38" text-anchor="middle" fill="white" font-size="24" font-weight="bold">ХИТ ПРОДАЖ</text></svg>',
      },
      {
        name: 'Новинка',
        category: 'badge',
        svgData: '<svg viewBox="0 0 200 60"><rect fill="#44aaff" rx="8" width="200" height="60"/><text x="100" y="38" text-anchor="middle" fill="white" font-size="24" font-weight="bold">НОВИНКА</text></svg>',
      },
      {
        name: 'Скидка -30%',
        category: 'promo',
        svgData: '<svg viewBox="0 0 200 60"><rect fill="#ff8800" rx="8" width="200" height="60"/><text x="100" y="38" text-anchor="middle" fill="white" font-size="24" font-weight="bold">-30%</text></svg>',
      },
      {
        name: 'Бесплатная доставка',
        category: 'info',
        svgData: '<svg viewBox="0 0 300 50"><rect fill="#22c55e" rx="8" width="300" height="50"/><text x="150" y="33" text-anchor="middle" fill="white" font-size="18" font-weight="bold">БЕСПЛАТНАЯ ДОСТАВКА</text></svg>',
      },
      {
        name: 'Premium качество',
        category: 'badge',
        svgData: '<svg viewBox="0 0 200 60"><rect fill="#a855f7" rx="8" width="200" height="60"/><text x="100" y="38" text-anchor="middle" fill="white" font-size="20" font-weight="bold">PREMIUM</text></svg>',
      },
    ],
  });

  console.log('Seed data created');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
