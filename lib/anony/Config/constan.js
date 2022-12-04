const constants = {
    bug_report: (pushname, sender, message) => `\`\`\`LAPORAN BUG\`\`\`\n\n*Dari* : ${pushname}\n*Nomor* : wa.me/${sender.replace(/@.+/,'')}\n*Pesan* : ${message}`,
    menu: (pushname, prefix, isOwner) => `Halo ${pushname}👋🏻, berikut perintah Anonymous Chat V2\n\n🗒️ ${prefix}menu - _melihat perintah yang tersedia_\n🔎 ${prefix}search - _mencari teman bicara_\n⏩ ${prefix}skip - _mencari teman lain_\n❌ ${prefix}stop - _berhenti sesi chatting_\n💌 ${prefix}sendprofile - _mengirim kontak pribadi anda ke teman chat_\n🔮 ${prefix}owner - _kirim kontak pemilik bot_\n⚠️ ${prefix}bug [pesanmu] - _mengirim laporan ke pemilik bot_\n${isOwner ? `📢 ${prefix}broadcast [Pesanmu] _Kirim broadcast ke semua kontak_` : ''}`,
    search: '\`\`\`[🔎] Mohon tunggu sedang mencari teman chat\`\`\`',
    stop: '\`\`\`[✅] Berhasil memberhentikan chat\`\`\`',
    skip: '\`\`\`[🔎] Skip chat, sedang mencari partner\`\`\`',
    sending_profile: `\`\`\`[👨‍🏫] Teman chat kamu memberikan kontak profil nya!\`\`\``,
    profile_sent: '\`\`\`[✅] Berhasil mengirim profil!\`\`\`',
    bug_reported: '\`\`\`[✅] Laporan anda berhasil terkirim\`\`\`',
    not_start: '\`\`\`[⚠️] Kamu belum pernah mulai chat!\`\`\` ❌',
    cannot_sendprofile: '\`\`\`[⚠️] Tidak bisa kirim profile, temukan teman chatting terlebih dahulu!\`\`\`',
    cannot_skip: '\`\`\`[⚠️] Tidak bisa skip saat mulai, pilih stop ❌ atau tunggu partner 🔎\`\`\`',
    cannot_start: '\`\`\`[⚠️] Tidak bisa search ulang saat mulai, pilih stop ❌ atau tunggu partner 🔎\`\`\`',
    partner_found: `\`\`\`[✅] Berhasil menemukan teman\`\`\`\n\nketik :\n*!anonstop* ( untuk berhenti chat )\n*!anonskip* ( untuk melewati chat ini )`,
    partner_stop: '\`\`\`[⚠️] Sesi chat ini telah diberhentikan oleh teman chat kamu\`\`\` ❌',
    partner_chatting: '\`\`\`[⚠️] Kamu masih dalam sesi chat dengan partner!\`\`\` ❌',
    display_search: '🔎 SEARCH 🔎',
    display_stop: '❌ STOP ❌',
    display_skip: '⏩ SKIP ⏩',
} 

module.exports = constants