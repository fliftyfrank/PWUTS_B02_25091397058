/* PinjamAlat – Admin Lab. Data disimpan di localStorage. */
const KEY = 'adminlab_v1', AKTIF = ['Menunggu Review','Pengecekan Barang','Siap Diambil','Dipinjam','Terlambat'];
const URUT = ['Menunggu Review','Pengecekan Barang','Siap Diambil','Dipinjam','Dikembalikan'];
const SEMUA = ['Menunggu Review','Ditolak','Pengecekan Barang','Siap Diambil','Dibatalkan – Barang Tidak Tersedia','Dibatalkan','Dipinjam','Terlambat','Dikembalikan'];
const hari = () => new Date().toISOString().slice(0,10);
const tambah = (t, n) => { const d = new Date(t); d.setDate(d.getDate() + n); return d.toISOString().slice(0,10); };
const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $c = () => $('#content');
const pesan = (sel, t, ok) => $(sel).attr('class', 'msg ' + (ok ? 'ok' : 'no')).text(t);
let DB;

function seed(){
  const a = (kode, nama, stok, maks, ik) => ({kode, nama, stok, total:stok, maks, ik, kondisi:'Baik'});
  const p = (id, nim, nama, kelas, alat, jumlah, x, y, matkul, dosen, perlu, status) => ({id, nim, nama, kelas, alat, jumlah, pinjam:tambah(hari(), x), kembali:tambah(hari(), y), matkul, dosen, perlu, status, catatan:''});
  const d = {alat:[a('PP-001','Kabel HDMI',8,3,'🔌'), a('PP-002','Proyektor',3,1,'📽️'), a('PP-003','Kabel LAN',15,3,'🌐'), a('PP-004','HDD Eksternal',5,3,'💾'), a('PP-005','Stopkontak (Terminal Listrik)',10,3,'🔌')],
    pj:[p(1,'25091397058','Rina Safitri','B','PP-001',2,1,3,'Pemrograman Web','Ari Kurniawan, S.Kom, M.T.','Presentasi proyek kelompok','Menunggu Review'),
        p(2,'25091397073','Dimas Aryo','A','PP-002',1,1,2,'Basis Data','Dosen Basis Data','Seminar hasil praktikum','Pengecekan Barang'),
        p(3,'25091397055','Salsa Putri','C','PP-003',3,0,2,'Jaringan Komputer','Dosen Jaringan','Praktikum jaringan kelas C','Siap Diambil'),
        p(4,'25091397056','Bagas Wicaksono','D','PP-004',1,-1,2,'Sistem Operasi','Dosen SO','Backup data praktikum','Dipinjam'),
        p(5,'25091397057','Nabila Rahma','I','PP-005',2,-5,-2,'Pemrograman Web','Ari Kurniawan, S.Kom, M.T.','Praktikum dengan laptop','Dipinjam')], log:[]};
  d.alat[3].stok = 4; d.alat[4].stok = 8; return d;
}
const simpan = () => { try { localStorage[KEY] = JSON.stringify(DB); } catch(x) {} };
const catat = t => { DB.log.unshift({w:new Date().toLocaleString('id-ID'), t}); DB.log.length = Math.min(DB.log.length, 50); };
const nm = k => (DB.alat.find(a => a.kode === k) || {nama:k}).nama;
function muatDB(){
  try { DB = JSON.parse(localStorage[KEY]); } catch(x) {}
  if(!DB || !DB.alat) DB = seed();
  DB.pj.forEach(p => { if(p.status === 'Dipinjam' && p.kembali < hari()) p.status = 'Terlambat'; });   // otomatis terlambat
  simpan();
}
function ubah(p, status, cat){ p.status = status; if(cat !== undefined) p.catatan = cat; catat(`Pengajuan #${p.id} (${nm(p.alat)}) menjadi ${status}`); simpan(); }
function unduh(nama, rows){
  const csv = '\ufeff' + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv'})); a.download = nama; a.click();
}

/* ===== 2.a Layout + navigasi Ajax ===== */
const INIT = {pengajuan:initPengajuan, 'data-alat':initAlat, laporan:initLaporan};
function buka(p){
  $('nav').removeClass('open'); $('nav a').removeClass('active').filter(`[data-page="${p}"]`).addClass('active');
  history.replaceState(null, '', '#' + p); window.scrollTo(0, 0);
  if(p === 'home') return home();
  $c().html('<p class="loading">Memuat halaman…</p>').load(`pages/${p}.html`, function(_, st){
    if(st === 'error') $c().html((window.PAGES || {})[p] || '<div class="msg no">Halaman gagal dimuat.</div>');   // cadangan jika dibuka via file://
    if(INIT[p] && $c().children().length > 1) INIT[p]();
  });
}
function home(){
  const n = s => DB.pj.filter(p => p.status === s).length;
  $c().html(`<section class="hero"><div><h1>Kelola peminjaman alat dari satu tempat</h1><p class="sub">Tinjau pengajuan mahasiswa, cek barang secara fisik, catat pengambilan dan pengembalian, kelola data alat, dan cetak laporan.</p>
    <a class="btn gold" href="#pengajuan" data-page="pengajuan">Buka pengajuan masuk</a></div><img src="img/hero.svg" alt="Ilustrasi pengelolaan alat"></section>
    <div class="stats">${AKTIF.map(s => `<div class="card"><b>${n(s)}</b><span>${s}</span></div>`).join('')}</div>
    <div class="card"><h3>Stok alat saat ini</h3><ul class="res">${DB.alat.map(a => `<li><span>${a.ik} ${e(a.nama)}</span><b>${a.stok} / ${a.total}</b></li>`).join('')}</ul></div>
    <h3 style="margin-top:18px">Aktivitas terakhir</h3><ul class="log card">${DB.log.slice(0,6).map(l => `<li>${e(l.t)}<br><small>${l.w}</small></li>`).join('') || '<li>Belum ada aktivitas. Mulai dari menu Pengajuan Masuk.</li>'}</ul>`);
}
$(function(){
  muatDB();
  $(document).on('click', 'a[data-page]', function(ev){ ev.preventDefault(); buka($(this).data('page')); });
  $('#menuBtn').on('click', () => $('nav').toggleClass('open'));
  const h = location.hash.slice(1); buka(['pengajuan','data-alat','laporan'].includes(h) ? h : 'home');
});

/* ===== 2.b Pengajuan masuk: review, cek barang, pengambilan, pengembalian ===== */
function initPengajuan(){
  let pilih = null;
  $('#fStatus').html('<option value="">Semua status</option>' + SEMUA.map(s => `<option>${s}</option>`).join(''));
  function gambar(){
    $('#stats').html(AKTIF.map(s => `<div class="card"><b>${DB.pj.filter(p => p.status === s).length}</b><span>${s}</span></div>`).join(''));
    const q = $('#cariPj').val().toLowerCase(), f = $('#fStatus').val();
    const d = DB.pj.filter(p => (!f || p.status === f) && `${p.nama} ${p.nim} ${nm(p.alat)}`.toLowerCase().includes(q)).reverse();
    $('#tbPj').html(d.map(p => `<tr data-id="${p.id}" class="${p.id === pilih ? 'sel' : ''}"><td>${p.id}</td><td>${e(p.nama)}<br><small>Kelas ${e(p.kelas)} · ${e(p.nim)}</small></td><td>${e(nm(p.alat))} ×${p.jumlah}</td><td>${p.pinjam} s/d ${p.kembali}</td><td><b>${p.status}</b></td></tr>`).join('')
      || '<tr><td colspan="5">Tidak ada pengajuan yang cocok. Ubah pencarian atau filter.</td></tr>');
    panel();
  }
  function panel(){
    const p = DB.pj.find(x => x.id === pilih); if(!p) return $('#panel').empty();
    const al = DB.alat.find(x => x.kode === p.alat) || {stok:0}, idx = p.status === 'Terlambat' ? 3 : URUT.indexOf(p.status);
    const alur = URUT.map((s, i) => `<li class="${idx > -1 && (i < idx || (i === idx && idx === 4)) ? 'done' : i === idx ? 'on' : ''}">${s}</li>`).join('');
    let info = '', aksi = '';
    if(['Menunggu Review','Pengecekan Barang'].includes(p.status)) info = `Stok tersedia ${al.stok}, diminta ${p.jumlah}${p.jumlah > al.stok ? ' (stok kurang)' : ''}.`;
    if(p.status === 'Siap Diambil') info = `Stok ${al.stok} menjadi ${al.stok - p.jumlah} setelah pengambilan dicatat.`;
    if(['Dipinjam','Terlambat'].includes(p.status)) info = `Stok ${al.stok} menjadi ${al.stok + p.jumlah} setelah pengembalian dicatat.`;
    if(p.status === 'Menunggu Review') aksi = '<label for="cat">Catatan admin (wajib jika menolak)</label><textarea id="cat" rows="2"></textarea><p><button class="btn gold" data-a="setuju">Setujui</button> <button class="btn ghost" data-a="tolak">Tolak</button></p>';
    else if(p.status === 'Pengecekan Barang') aksi = '<p><b>Pengecekan barang secara fisik</b></p><label><input type="radio" name="cek" value="1">Tersedia</label><label><input type="radio" name="cek" value="0">Tidak tersedia</label><p><button class="btn" data-a="cek">Simpan hasil</button></p>';
    else if(p.status === 'Siap Diambil') aksi = '<p><button class="btn" data-a="ambil">Catat pengambilan</button></p>';
    else if(['Dipinjam','Terlambat'].includes(p.status)) aksi = '<label for="kon">Kondisi alat saat kembali</label><select id="kon"><option>Baik</option><option>Rusak ringan</option><option>Rusak berat</option></select><p><button class="btn" data-a="kembali">Catat pengembalian</button></p>';
    const li = (k, v) => `<li><span>${k}</span><b>${e(v)}</b></li>`;
    $('#panel').html(`<div class="card f" style="margin-top:18px"><h3>Detail pengajuan #${p.id}</h3><ol class="alur">${alur}</ol><ul class="res">${li('Peminjam', p.nama + ' (' + p.nim + ')')}${li('Kelas / Prodi', p.kelas + ' / Manajemen Informatika')}
      ${li('Alat & jumlah', nm(p.alat) + ' ×' + p.jumlah)}${li('Tanggal', p.pinjam + ' s/d ' + p.kembali)}${li('Mata kuliah', p.matkul)}${li('Dosen pengampu', p.dosen)}${li('Keperluan', p.perlu)}${li('Status', p.status)}${p.catatan ? li('Catatan', p.catatan) : ''}${p.kondisi ? li('Kondisi kembali', p.kondisi) : ''}</ul>
      ${info ? `<p class="hint">${info}</p>` : ''}${aksi || '<p class="hint">Proses pengajuan ini sudah selesai.</p>'}</div>`);
  }
  $('#cariPj, #fStatus').on('input change', gambar);
  $('#tbPj').on('click', 'tr[data-id]', function(){ pilih = +$(this).data('id'); gambar(); $('#panel')[0].scrollIntoView({behavior:'smooth', block:'nearest'}); });
  $('#panel').on('click', '[data-a]', function(){
    const p = DB.pj.find(x => x.id === pilih), al = DB.alat.find(x => x.kode === p.alat), a = $(this).data('a');
    if(a === 'setuju') ubah(p, 'Pengecekan Barang', $('#cat').val());
    if(a === 'tolak'){ if(!$('#cat').val().trim()) return alert('Isi catatan alasan penolakan.'); ubah(p, 'Ditolak', $('#cat').val()); }
    if(a === 'cek'){ const v = $('[name=cek]:checked').val(); if(!v) return alert('Pilih hasil pengecekan.'); ubah(p, v === '1' ? 'Siap Diambil' : 'Dibatalkan – Barang Tidak Tersedia'); }
    if(a === 'ambil'){ if(al.stok < p.jumlah) return alert('Stok tidak cukup.'); al.stok -= p.jumlah; ubah(p, 'Dipinjam'); }
    if(a === 'kembali'){ const tel = p.status === 'Terlambat'; al.stok += p.jumlah; p.kondisi = $('#kon').val(); ubah(p, 'Dikembalikan', tel ? 'Dikembalikan terlambat' : ''); }
    gambar();
  });
  gambar();
}

/* ===== 2.c Data alat: form + validasi jQuery + kirim ke server ===== */
function initAlat(){
  let edit = null;
  const pakai = () => { const a = DB.alat.find(x => x.kode === edit); return a ? a.total - a.stok : 0; };
  const batas = () => /proyektor/i.test($('#anama').val()) ? 1 : 3;
  const aturan = {
    akode: v => !/^PP-\d{3}$/.test(v) ? 'Kode harus berformat PP-006 (PP- diikuti 3 angka).' : (!edit && DB.alat.some(a => a.kode === v)) ? 'Kode sudah dipakai alat lain.' : true,
    anama: v => v.length >= 3 || 'Nama alat minimal 3 karakter.',
    akat: v => !!v || 'Pilih kategori alat.',
    astok: v => (!/^\d+$/.test(v) || +v < 1 || +v > 200) ? 'Stok total harus angka 1 sampai 200.' : +v < pakai() ? `Stok total tidak boleh di bawah jumlah yang sedang dipinjam (${pakai()}).` : true,
    akon: v => !!v || 'Pilih kondisi alat.',
    amaks: v => (/^\d+$/.test(v) && +v >= 1 && +v <= batas()) || `Durasi harus 1 sampai ${batas()} hari.`,
    aik: v => !!v || 'Pilih ikon alat.'
  };
  const cek = id => { const r = aturan[id]($('#' + id).val().trim()), ok = r === true; $('#' + id).toggleClass('bad', !ok); $('#e_' + id).text(ok ? '' : r); return ok; };
  Object.keys(aturan).forEach(id => $('#' + id).on('blur change', () => cek(id)));
  $('#anama').on('input', () => { if($('#amaks').val()) cek('amaks'); });
  const batal = () => { edit = null; $('#akode').prop('readonly', false); $('#judul').text('Tambah alat baru'); $('#simpan').text('Simpan alat'); $('.bad').removeClass('bad'); $('#fAlat .err').text(''); };
  $('#fAlat').on('reset', batal);
  const tabel = () => { const q = $('#cariAlat').val().toLowerCase();
    $('#tbAlat').html(DB.alat.filter(a => (a.kode + a.nama).toLowerCase().includes(q)).map(a => `<tr><td class="ik">${a.ik}</td><td>${e(a.kode)}</td><td>${e(a.nama)}</td><td>${a.stok} / ${a.total}</td><td>${e(a.kondisi)}</td><td>${a.maks} hari</td>
      <td><button class="btn ghost sm" data-u="${e(a.kode)}">Ubah</button> <button class="btn ghost sm" data-h="${e(a.kode)}">Hapus</button></td></tr>`).join('') || '<tr><td colspan="7">Tidak ada alat yang cocok.</td></tr>'); };
  $('#cariAlat').on('input', tabel);
  $('#tbAlat').on('click', '[data-u]', function(){
    const a = DB.alat.find(x => x.kode === $(this).data('u')); batal(); edit = a.kode;
    $('#akode').val(a.kode).prop('readonly', true); $('#anama').val(a.nama); $('#akat').val('1'); $('#astok').val(a.total); $('#akon').val(a.kondisi); $('#amaks').val(a.maks); $('#aik').val(a.ik);
    $('#judul').text('Ubah alat ' + a.kode); $('#simpan').text('Simpan perubahan'); $('#anama').focus();
  }).on('click', '[data-h]', function(){
    const k = $(this).data('h');
    if(DB.pj.some(p => p.alat === k && AKTIF.includes(p.status))) return alert('Alat masih dipakai pada peminjaman aktif.');
    if(confirm('Hapus alat ' + k + '?')){ DB.alat = DB.alat.filter(a => a.kode !== k); catat('Menghapus alat ' + k); simpan(); tabel(); }
  });
  $('#fAlat').on('submit', function(ev){
    ev.preventDefault();                                    // validasi sebelum submit ke server
    if(!Object.keys(aturan).map(cek).every(Boolean)){ pesan('#hasil', 'Formulir belum benar. Perbaiki kolom bertanda merah.', 0); return $('.bad').first().focus(); }
    const d = {kode:$('#akode').val().trim(), nama:$('#anama').val().trim(), id_kategori:1, stok_total:+$('#astok').val(), kondisi:$('#akon').val(), maks_durasi_hari:+$('#amaks').val(), ikon:$('#aik').val(), mode:edit ? 'ubah' : 'tambah'};
    $('#simpan').prop('disabled', true).text('Mengirim…');
    const lokal = ketSrv => {
      const a = DB.alat.find(x => x.kode === d.kode);
      if(a){ a.stok = Math.max(0, a.stok + d.stok_total - a.total); Object.assign(a, {nama:d.nama, total:d.stok_total, maks:d.maks_durasi_hari, kondisi:d.kondisi, ik:d.ikon}); }
      else DB.alat.push({kode:d.kode, nama:d.nama, stok:d.stok_total, total:d.stok_total, maks:d.maks_durasi_hari, ik:d.ikon, kondisi:d.kondisi});
      catat((d.mode === 'ubah' ? 'Mengubah' : 'Menambah') + ' data alat ' + d.kode); simpan();
      $('#fAlat')[0].reset(); pesan('#hasil', `Alat ${d.kode} tersimpan. ${ketSrv}`, 1); tabel();
    };
    $.ajax({url:'/api/alat', method:'POST', contentType:'application/json', data:JSON.stringify(d)})
      .done(() => lokal('Data juga terkirim ke server.'))
      .fail(() => lokal('Server belum aktif, data disimpan di browser. Jalankan python server.py agar terkirim ke server.'))
      .always(() => $('#simpan').prop('disabled', false));
  });
  tabel();
}

/* ===== Laporan: cetak dan CSV ===== */
function initLaporan(){
  const data = () => { const a = $('#l1').val() || '0000', b = $('#l2').val() || '9999'; return DB.pj.filter(p => p.pinjam >= a && p.pinjam <= b); };
  const tb = (h, r) => `<div class="wrapx"><table class="tb"><thead><tr>${h.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${r.join('') || `<tr><td colspan="${h.length}">Belum ada data pada periode ini.</td></tr>`}</tbody></table></div>`;
  const isi = () => { const d = data();
    $('#lh').html(`<h3>Peminjaman (${d.length})</h3>` + tb(['#','Peminjam','Alat','Jml','Pinjam','Kembali','Status'], d.map(p => `<tr><td>${p.id}</td><td>${e(p.nama)}</td><td>${e(nm(p.alat))}</td><td>${p.jumlah}</td><td>${p.pinjam}</td><td>${p.kembali}</td><td>${p.status}</td></tr>`))
      + '<h3 style="margin-top:18px">Inventaris</h3>' + tb(['Kode','Alat','Total','Tersedia','Kondisi','Maks. durasi'], DB.alat.map(a => `<tr><td>${e(a.kode)}</td><td>${e(a.nama)}</td><td>${a.total}</td><td>${a.stok}</td><td>${e(a.kondisi)}</td><td>${a.maks} hari</td></tr>`))); };
  $('#l1, #l2').on('change', isi); isi();
  $('#cetak').on('click', () => window.print());
  $('#csv').on('click', () => unduh('laporan_peminjaman.csv', [['ID','Peminjam','NIM','Alat','Jumlah','Pinjam','Kembali','Status','Kondisi kembali']].concat(data().map(p => [p.id, p.nama, p.nim, nm(p.alat), p.jumlah, p.pinjam, p.kembali, p.status, p.kondisi || '']))));
}
