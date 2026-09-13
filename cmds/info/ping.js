import db from "#db"
export default {
  command: ['ping', 'p'],
  category: 'info',
  run: async ({ msg, sock }) => {
    const start = Date.now()
    const settings = await db.getSettings(sock.user.id.split(':')[0] + "@s.whatsapp.net")
    const botname = settings.namebot

    const sent = await sock.sendMessage(
      msg.chat,
      { text:
`🌀⚡ 〔 RIMURU TEMPEST 〕 ⚡🌀
───≪ Great Sage / Raphael ≫───
┌────────────────────────
│ ⚡ ¡Pong!
│ > *${botname}*
└────────────────────────
"Sabio Superior: Midiendo velocidad de respuesta..."` },
      { quoted: msg }
    )

    const latency = Date.now() - start

    await sock.sendMessage(
      msg.chat,
      { text:
`🌀⚡ 〔 RIMURU TEMPEST 〕 ⚡🌀
───≪ Great Sage / Raphael ≫───
┌────────────────────────
│ ⚡ ¡Pong!
│ > Velocidad ⴵ ${latency}ms
└────────────────────────
"¡Análisis completado con éxito!"`,
        edit: sent.key },
      { quoted: msg }
    )
  },
};
