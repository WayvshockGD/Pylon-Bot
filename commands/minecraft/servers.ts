const prefix = '!';
const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

cmd.raw({
  name: 'servers',
  aliases: ['ip'],
  description: 'Displays a list of the guild\'s minecraft servers',
  filters: USER_PERMS
},
  async (message) => {
    const richEmbed = new discord.Embed();
    richEmbed.setColor(0x00ffa6),
    richEmbed.addField({
      name: 'Minecraft Servers',
      value:
        `
          ===========================================
          **Name**: MagmaCraft
          **Type**: Java | Magma
          **Version**: 1.16.4 Pre Release
          **Address**: magmacraft.aeromc.net:25565
          ===========================================
          **Name**: AeroSky
          **Type**: Java
          **Version**: 1.8.8
          **Address**: aerosky.aeromc.net:25565
          ===========================================
          `,
      inline: true
    }),
      richEmbed.setImage({ url: 'https://imgur.com/7R4CbPH.png' }),
      richEmbed.setTimestamp,
      richEmbed.setFooter({ text: 'https://www.aeromc.net' });
    await message.reply(richEmbed);
  });
