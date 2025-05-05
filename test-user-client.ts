import { ClientProxyFactory, Transport } from '@nestjs/microservices';

async function test() {
  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3001,
    },
  });

  const response = await client.send({ cmd: 'get_users' }, {}).toPromise();
  console.log('Response from Users Microservice:', response);
  process.exit(0);
}

test();
