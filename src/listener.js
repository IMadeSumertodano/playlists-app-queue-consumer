class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = async (message) => {
      try {
        const { playlistId, targetEmail } = JSON.parse(
          message.content.toString()
        );

        const playlists = await this._playlistsService.getSongsInPlaylist(
          playlistId
        );
        const result = await this._mailSender.sendEmail(
          targetEmail,
          JSON.stringify({ playlists })
        );
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };
  }
}

module.exports = Listener;
