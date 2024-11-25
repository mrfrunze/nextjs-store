import prisma from '../../../utils/db';

export async function GET(req) {
  try {
    // Простой запрос к базе данных
    await prisma.$queryRaw`SELECT 1`;
    return new Response(JSON.stringify({ message: 'Database pinged successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error pinging database:', error);
    return new Response(JSON.stringify({ error: 'Failed to ping database' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
