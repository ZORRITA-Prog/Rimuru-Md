import db from "#db"
export default {
  command: ['report', 'reporte', 'sug', 'suggest'],
  category: 'info',
  run: async ({ msg, sock, args, command }) => {
    const texto = args.join(' ').trim()
    const now = Date.now()

    try {
      const userData = await db.getUser(msg.sender)

      const cooldown = userData.sugCooldown || 0
      const restante = cooldown - now
      if (restante > 0) {
        return msg.reply(
`🌀⚡ 〔 RIMURU TEMPEST 〕 ⚡🌀
───≪ Aviso de Enfriamiento ≫───
┌────────────────────────
│ ⏳ Espera *${msToTime(restante)}* para enviar otro mensaje.
└────────────────────────
"Sabio Superior: Proceso de enfriamiento en curso."`)
      }

      if (!texto) {
        return msg.reply(
`🌀⚡ 〔 RIMURU TEMPEST 〕 ⚡🌀
───≪ Petición de Análisis ≫───
┌────────────────────────
│ 📄 Debes escribir un reporte o sugerencia válida.
└────────────────────────
"Sabio Superior: Esperando contenido para transmitir..."`)
      }

      if (texto.length < 10) {
        return msg.reply(
`🌀⚡ 〔 RIMURU TEMPEST 〕 ⚡🌀
───≪ Datos Insuficientes ≫───
┌────────────────────────
│ ⚠️ Tu mensaje es muy corto. Explica mejor tu reporte/sugerencia (mín. 10 caracteres).
└────────────────────────
"Sabio Superior: Requiere mayor detalle para procesar."`)
      }

      const fecha = new Date()
      const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      const fechaLocal = fecha.toLocaleDateString('es-MX', opcionesFecha)

      const tipo = (command === 'report' || command === 'reporte') ? '🔹 Reporte' : '🔹 Sugerencia'
      const displayName = msg.pushName || 'Usuario desconocido'
      const numero = msg.sender.split('@')[0]

      let reportMsg =
`🌀⚡ 〔 RIMURU TEMPEST 〕 ⚡🌀
───≪ Great Sage / Raphael ≫───
┌────────────────────────
│ 📜 Transmisión de ${tipo}
└────────────────────────

👤 Ciudadano › ${displayName}
📱 Contacto › wa.me/${numero}
📅 Fecha › ${fechaLocal}

📝 Mensaje › ${texto}
└────────────────────────
"Enviado desde el Reino de Tempest."`

      try {
        await global.sock.reply('120363416930479619@g.us', reportMsg, msg)
      } catch {
        try {
          for (const nums of global.mods) {
            await sock.reply(`${nums}@s.whatsapp.net`, reportMsg, msg)
          }
        } catch {}
      }

      userData.sugCooldown = now + 24 * 60 * 60000
      await db.updateUser(msg.sender, 'sugCooldown', userData.sugCooldown)

      msg.reply(
`🌀⚡ 〔 RIMURU TEMPEST 〕 ⚡🌀
───≪ Transmisión Exitosa ≫───
┌────────────────────────
│ ✅ Gracias por tu ${(command === 'report' || command === 'reporte') ? 'reporte' : 'sugerencia'}.
│ > Tu mensaje fue enviado correctamente a los moderadores.
└────────────────────────
"¡Todo está bajo control gracias al Gran Sabio!"`)
    } catch {
      msg.reply(
`🌀⚡ 〔 RIMURU TEMPEST 〕 ⚡🌀
───≪ Error del Sistema ≫───
┌────────────────────────
│ ❌ Ocurrió un error al procesar tu reporte/sugerencia.
└────────────────────────
"Sabio Superior: Fallo al transmitir el mensaje."`)
    }
  },
}

const msToTime = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  const days = Math.floor(duration / (1000 * 60 * 60 * 24))

  const s = seconds.toString().padStart(2, '0')
  const msg = minutes.toString().padStart(2, '0')
  const h = hours.toString().padStart(2, '0')
  const d = days.toString()

  const parts = []
  if (days > 0) parts.push(`${d} día${d > 1 ? 's' : ''}`)
  if (hours > 0) parts.push(`${h} hora${h > 1 ? 's' : ''}`)
  if (minutes > 0) parts.push(`${msg} minuto${msg > 1 ? 's' : ''}`)
  parts.push(`${s} segundo${s > 1 ? 's' : ''}`)

  return parts.join(', ')
}
