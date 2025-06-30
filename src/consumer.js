require("dotenv").config();
const amqp = require("amqplib");
const PlaylistsService = require("./PlaylistsService");
const MailSender = require("./MailSender");
const Listener = require("./listener");

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  // membuat koneksi dengan server RabbitMQ
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  // membuat channel
  const channel = await connection.createChannel();

  // memastikan queue dengan nama export:playlists telah terbuat menggunakan fungsi channel.assertQueue
  await channel.assertQueue("export:playlists", {
    durable: true,
  });

  // consume queue export:playlists dengan menetapkan listener.listen sebagai fungsi callback-nya
  channel.consume("export:playlists", listener.listen, { noAck: true });
};
init();
