const amqp = require("amqplib");

async function worker() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "task_queue";

    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.prefetch(1);

    console.log(" [*] Waiting for messages…");

    channel.consume(queue, async (msg) => {
      const content = msg.content.toString();
      const seconds = content.split(".").length - 1;

      console.log(" [x] Received:", content);

      await new Promise((resolve) => setTimeout(resolve, seconds * 1000));

      console.log(" [x] Done");

      channel.ack(msg);

    }, { noAck: false });

  } catch (err) {
    console.error("Error:", err);
  }
}

worker();
