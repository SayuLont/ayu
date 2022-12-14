const constants = {
    bug_report: (pushname, sender, message) => `\`\`\`LAPORAN BUG\`\`\`\n\n*Dari* : ${pushname}\n*Nomor* : wa.me/${sender.replace(/@.+/,'')}\n*Pesan* : ${message}`,
    menu: (pushname, prefix, isOwner) => `Halo ${pushname}šš», berikut perintah Anonymous Chat V2\n\nšļø ${prefix}menu - _melihat perintah yang tersedia_\nš ${prefix}search - _mencari teman bicara_\nā© ${prefix}skip - _mencari teman lain_\nā ${prefix}stop - _berhenti sesi chatting_\nš ${prefix}sendprofile - _mengirim kontak pribadi anda ke teman chat_\nš® ${prefix}owner - _kirim kontak pemilik bot_\nā ļø ${prefix}bug [pesanmu] - _mengirim laporan ke pemilik bot_\n${isOwner ? `š¢ ${prefix}broadcast [Pesanmu] _Kirim broadcast ke semua kontak_` : ''}`,
    search: '\`\`\`[š] Mohon tunggu sedang mencari teman chat\`\`\`',
    stop: '\`\`\`[ā] Berhasil memberhentikan chat\`\`\`',
    skip: '\`\`\`[š] Skip chat, sedang mencari partner\`\`\`',
    sending_profile: `\`\`\`[šØāš«] Teman chat kamu memberikan kontak profil nya!\`\`\``,
    profile_sent: '\`\`\`[ā] Berhasil mengirim profil!\`\`\`',
    bug_reported: '\`\`\`[ā] Laporan anda berhasil terkirim\`\`\`',
    not_start: '\`\`\`[ā ļø] Kamu belum pernah mulai chat!\`\`\` ā',
    cannot_sendprofile: '\`\`\`[ā ļø] Tidak bisa kirim profile, temukan teman chatting terlebih dahulu!\`\`\`',
    cannot_skip: '\`\`\`[ā ļø] Tidak bisa skip saat mulai, pilih stop ā atau tunggu partner š\`\`\`',
    cannot_start: '\`\`\`[ā ļø] Tidak bisa search ulang saat mulai, pilih stop ā atau tunggu partner š\`\`\`',
    partner_found: `\`\`\`[ā] Berhasil menemukan teman\`\`\`\n\nketik :\n*!anonstop* ( untuk berhenti chat )\n*!anonskip* ( untuk melewati chat ini )`,
    partner_stop: '\`\`\`[ā ļø] Sesi chat ini telah diberhentikan oleh teman chat kamu\`\`\` ā',
    partner_chatting: '\`\`\`[ā ļø] Kamu masih dalam sesi chat dengan partner!\`\`\` ā',
    display_search: 'š SEARCH š',
    display_stop: 'ā STOP ā',
    display_skip: 'ā© SKIP ā©',
} 

module.exports = constants