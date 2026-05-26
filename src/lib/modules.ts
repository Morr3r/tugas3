export type ModuleIcon =
  | "syntax"
  | "data"
  | "flow"
  | "function"
  | "oop"
  | "file"
  | "debug"
  | "api";

type MiniGameBase = {
  id: string;
  title: string;
  prompt: string;
  hint: string;
};

export type SequenceGame = MiniGameBase & {
  kind: "sequence";
  options: string[];
  answer: string[];
};

export type ChoiceGame = MiniGameBase & {
  kind: "choice";
  options: string[];
  answer: string;
};

export type LocateGame = MiniGameBase & {
  kind: "locate";
  codeLines: Array<{
    id: string;
    label: string;
    text: string;
  }>;
  answer: string;
};

export type OutputGame = MiniGameBase & {
  kind: "output";
  code: string;
  options: string[];
  answer: string;
};

export type LiveCodeGame = MiniGameBase & {
  kind: "live-code";
  starter: string;
  requirements: string[];
  checks: Array<{
    label: string;
    pattern: string;
    flags?: string;
  }>;
  successMessage: string;
};

export type MiniGame =
  | SequenceGame
  | ChoiceGame
  | LocateGame
  | OutputGame
  | LiveCodeGame;

export type LmsModule = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  focus: string;
  minutes: number;
  level: string;
  color: string;
  icon: ModuleIcon;
  theory: string[];
  skills: string[];
  code: string;
  mission: string;
  games: MiniGame[];
};

export type LmsCourse = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  label: string;
  description: string;
  stack: string;
  level: string;
  modules: LmsModule[];
};

export const modules: LmsModule[] = [
  {
    id: 1,
    slug: "python-fundamental",
    title: "Modul 1",
    subtitle: "Python Fundamental",
    focus: "Sintaks, variabel, input, dan output",
    minutes: 45,
    level: "Dasar",
    color: "#37e5a5",
    icon: "syntax",
    theory: [
      "Python membaca instruksi dari atas ke bawah, jadi urutan kode menentukan hasil program.",
      "Variabel dipakai untuk menyimpan nilai seperti teks, angka, dan status logika.",
      "F-string membuat output lebih rapi karena nilai variabel dapat disisipkan langsung ke teks.",
      "Saat memakai print(), bedakan teks literal dan nilai variabel. Teks literal ditulis di dalam tanda kutip, sedangkan variabel dipanggil memakai namanya.",
      "input() selalu menghasilkan string. Jika data dari pengguna akan dihitung sebagai angka, ubah dulu dengan int() atau float().",
      "Nama variabel sebaiknya jelas seperti nama_siswa, kelas, atau target_karier agar kode mudah dipahami ketika dibaca ulang.",
      "Error dasar seperti SyntaxError biasanya muncul karena tanda kutip, kurung, atau titik dua belum lengkap. Biasakan membaca baris error dari terminal.",
    ],
    skills: ["print()", "variabel", "f-string"],
    code: `nama = "Afghany"
kelas = "XII RPL"
target = "Backend Developer"

print(f"{nama} dari {kelas} sedang belajar Python untuk menjadi {target}.")`,
    mission:
      "Buat program perkenalan digital untuk profil siswa XII RPL SMKN 13 Bandung.",
    games: [
      {
        id: "m1-choice",
        kind: "choice",
        title: "Variable Scanner",
        prompt: "Manakah nama variabel Python yang valid dan mudah dibaca?",
        options: ["nama_siswa", "2nama", "nama-siswa", "class"],
        answer: "nama_siswa",
        hint: "Variabel tidak boleh diawali angka, memakai tanda minus, atau memakai keyword.",
      },
      {
        id: "m1-sequence",
        kind: "sequence",
        title: "Syntax Sequencer",
        prompt:
          "Susun instruksi berikut agar terminal menampilkan profil siswa dengan benar.",
        options: [
          `print(f"Halo {nama}, kelas {kelas}")`,
          `kelas = "XII RPL"`,
          `nama = "Afghany"`,
        ],
        answer: [
          `nama = "Afghany"`,
          `kelas = "XII RPL"`,
          `print(f"Halo {nama}, kelas {kelas}")`,
        ],
        hint: "Nilai variabel harus dibuat sebelum dipakai oleh print().",
      },
      {
        id: "m1-locate",
        kind: "locate",
        title: "Quote Breaker",
        prompt: "Klik baris yang membuat SyntaxError karena tanda kutip tidak lengkap.",
        codeLines: [
          { id: "1", label: "01", text: `nama = "Dina"` },
          { id: "2", label: "02", text: `kelas = "XII RPL` },
          { id: "3", label: "03", text: `print(nama)` },
          { id: "4", label: "04", text: `print(kelas)` },
        ],
        answer: "2",
        hint: "String harus dibuka dan ditutup dengan tanda kutip yang sepasang.",
      },
      {
        id: "m1-output",
        kind: "output",
        title: "Terminal Vision",
        prompt: "Output apa yang muncul dari kode berikut?",
        code: `nama = "Afghany"
kelas = "XII RPL"
print(f"{nama} - {kelas}")`,
        options: ["Afghany - XII RPL", "{nama} - {kelas}", "nama - kelas", "Error"],
        answer: "Afghany - XII RPL",
        hint: "F-string mengganti placeholder dengan nilai variabel.",
      },
      {
        id: "m1-live",
        kind: "live-code",
        title: "Live Coding: Kartu Profil",
        prompt:
          "Tulis kode Python untuk membuat variabel nama dan kelas, lalu tampilkan memakai f-string.",
        starter: `# Buat kartu profil siswa
nama = ""
kelas = ""

`,
        requirements: [
          "Ada variabel nama berisi teks.",
          "Ada variabel kelas berisi XII RPL.",
          "Ada print() yang memakai f-string.",
        ],
        checks: [
          { label: "variabel nama", pattern: "nama\\s*=\\s*[\"'][^\"']+[\"']" },
          { label: "kelas XII RPL", pattern: "kelas\\s*=\\s*[\"']XII RPL[\"']" },
          { label: "print f-string", pattern: "print\\s*\\(\\s*f[\"']" },
        ],
        successMessage: "Kartu profil Python sudah valid.",
        hint: "Contoh pola: nama = \"Afghany\", kelas = \"XII RPL\", lalu print(f\"...\").",
      },
    ],
  },
  {
    id: 2,
    slug: "tipe-data",
    title: "Modul 2",
    subtitle: "Tipe Data dan Struktur Data",
    focus: "String, integer, boolean, list, tuple, dan dictionary",
    minutes: 50,
    level: "Dasar",
    color: "#74d4ff",
    icon: "data",
    theory: [
      "Tipe data membantu Python memahami operasi yang valid untuk sebuah nilai.",
      "List cocok untuk kumpulan data yang bisa berubah, seperti daftar nilai siswa.",
      "Dictionary menyimpan data berpasangan key dan value, ideal untuk profil atau konfigurasi.",
      "String dapat diproses sebagai teks utuh atau diambil per karakter dengan indexing, misalnya nama[0] untuk huruf pertama.",
      "List mendukung operasi append(), len(), sum(), dan indexing sehingga cocok untuk data berurutan seperti nilai tugas.",
      "Tuple cocok untuk data yang tidak sering berubah, misalnya koordinat, ukuran layar, atau konfigurasi tetap.",
      "Key pada dictionary harus konsisten. Jika data memakai key nama, maka pemanggilan siswa[\"nama\"] harus sama persis.",
      "Saat data berbentuk nested, periksa dulu bentuknya: list memakai index angka, sedangkan dictionary memakai key teks.",
    ],
    skills: ["list", "dict", "indexing"],
    code: `siswa = {
    "nama": "Raka",
    "kelas": "XII RPL",
    "nilai": [88, 92, 95],
}

rata_rata = sum(siswa["nilai"]) / len(siswa["nilai"])
print(f"Rata-rata {siswa['nama']}: {rata_rata}")`,
    mission:
      "Modelkan data siswa, nilai, dan status proyek dalam struktur data Python.",
    games: [
      {
        id: "m2-choice",
        kind: "choice",
        title: "Data Type Matcher",
        prompt:
          "Kamu perlu menyimpan daftar nilai yang bisa ditambah setelah remedial. Struktur paling tepat adalah...",
        options: ["tuple", "list", "boolean", "string"],
        answer: "list",
        hint: "Pilih struktur yang mutable dan bisa menyimpan banyak item berurutan.",
      },
      {
        id: "m2-sequence",
        kind: "sequence",
        title: "Average Pipeline",
        prompt: "Susun kode agar program menghitung rata-rata nilai.",
        options: [
          `print(rata_rata)`,
          `rata_rata = sum(nilai) / len(nilai)`,
          `nilai = [80, 90, 100]`,
        ],
        answer: [
          `nilai = [80, 90, 100]`,
          `rata_rata = sum(nilai) / len(nilai)`,
          `print(rata_rata)`,
        ],
        hint: "Data list harus dibuat sebelum dihitung.",
      },
      {
        id: "m2-locate",
        kind: "locate",
        title: "Dictionary Key Hunt",
        prompt: "Klik baris yang berpotensi KeyError karena key tidak tersedia.",
        codeLines: [
          { id: "1", label: "01", text: `siswa = {"nama": "Raka", "kelas": "XII RPL"}` },
          { id: "2", label: "02", text: `print(siswa["nama"])` },
          { id: "3", label: "03", text: `print(siswa["jurusan"])` },
          { id: "4", label: "04", text: `print(siswa["kelas"])` },
        ],
        answer: "3",
        hint: "Dictionary hanya bisa mengambil key yang memang ada.",
      },
      {
        id: "m2-output",
        kind: "output",
        title: "Index Decoder",
        prompt: "Output apa yang muncul dari kode berikut?",
        code: `stack = ["HTML", "CSS", "Python"]
print(stack[2])`,
        options: ["HTML", "CSS", "Python", "IndexError"],
        answer: "Python",
        hint: "Index list dimulai dari 0.",
      },
      {
        id: "m2-live",
        kind: "live-code",
        title: "Live Coding: Profil Dictionary",
        prompt:
          "Tulis dictionary siswa dengan nama, kelas, dan list nilai. Lalu hitung rata-ratanya.",
        starter: `# Buat data siswa
siswa = {

}

`,
        requirements: [
          "Ada dictionary bernama siswa.",
          "Dictionary punya key nilai berisi list angka.",
          "Rata-rata dihitung dengan sum() dan len().",
        ],
        checks: [
          { label: "dictionary siswa", pattern: "siswa\\s*=\\s*\\{" },
          { label: "list nilai", pattern: "[\"']nilai[\"']\\s*:\\s*\\[[^\\]]+\\]" },
          { label: "sum dan len", pattern: "sum\\s*\\([^\\)]*\\).*len\\s*\\(", flags: "s" },
        ],
        successMessage: "Data siswa dan perhitungan rata-rata sudah valid.",
        hint: "Gunakan siswa = {\"nilai\": [88, 92, 95]} lalu sum(siswa[\"nilai\"]) / len(...).",
      },
    ],
  },
  {
    id: 3,
    slug: "control-flow",
    title: "Modul 3",
    subtitle: "Control Flow",
    focus: "Percabangan, perulangan, dan logika program",
    minutes: 55,
    level: "Menengah",
    color: "#ffd166",
    icon: "flow",
    theory: [
      "Percabangan membuat program bisa memilih keputusan berdasarkan kondisi.",
      "Perulangan mengulang blok kode selama syarat terpenuhi atau selama item masih tersedia.",
      "Operator logika membantu menggabungkan beberapa kondisi menjadi satu aturan bisnis.",
      "Ekspresi kondisi selalu berakhir menjadi True atau False. Dari hasil itulah Python menentukan blok if, elif, atau else yang dijalankan.",
      "Indentasi adalah bagian dari sintaks Python. Baris yang masuk ke blok if, for, atau while harus sejajar dengan benar.",
      "for cocok dipakai ketika jumlah data sudah jelas, misalnya menelusuri list nilai atau daftar nama siswa.",
      "while cocok dipakai ketika pengulangan bergantung pada kondisi tertentu, tetapi harus ada perubahan kondisi agar tidak menjadi infinite loop.",
      "Aturan bisnis sebaiknya ditulis dari kondisi paling spesifik ke kondisi umum supaya hasil keputusan tidak tertutup oleh kondisi sebelumnya.",
    ],
    skills: ["if", "for", "while"],
    code: `nilai = 86
absen = 96

if nilai >= 80 and absen >= 90:
    status = "Lulus dengan rekomendasi industri"
elif nilai >= 75:
    status = "Lulus"
else:
    status = "Perlu penguatan"

print(status)`,
    mission:
      "Bangun logika kelulusan siswa berdasarkan nilai proyek dan kehadiran.",
    games: [
      {
        id: "m3-choice",
        kind: "choice",
        title: "Logic Gate",
        prompt: "Operator mana yang membuat dua kondisi harus sama-sama benar?",
        options: ["or", "and", "not", "in"],
        answer: "and",
        hint: "Operator ini sering dipakai untuk syarat ganda.",
      },
      {
        id: "m3-sequence",
        kind: "sequence",
        title: "Flow Gate",
        prompt:
          "Urutkan jalur keputusan agar program memberi status berdasarkan nilai.",
        options: [
          `else: status = "Perlu penguatan"`,
          `if nilai >= 80: status = "Kompeten"`,
          `elif nilai >= 75: status = "Lulus"`,
        ],
        answer: [
          `if nilai >= 80: status = "Kompeten"`,
          `elif nilai >= 75: status = "Lulus"`,
          `else: status = "Perlu penguatan"`,
        ],
        hint: "Percabangan dimulai dari if, dilanjutkan elif, lalu ditutup else.",
      },
      {
        id: "m3-locate",
        kind: "locate",
        title: "Indentation Radar",
        prompt: "Klik baris yang salah indentasi dan akan merusak blok if.",
        codeLines: [
          { id: "1", label: "01", text: `nilai = 90` },
          { id: "2", label: "02", text: `if nilai >= 80:` },
          { id: "3", label: "03", text: `print("Kompeten")` },
          { id: "4", label: "04", text: `else:` },
        ],
        answer: "3",
        hint: "Isi blok if harus menjorok ke dalam.",
      },
      {
        id: "m3-output",
        kind: "output",
        title: "Branch Predictor",
        prompt: "Status apa yang dicetak program?",
        code: `nilai = 78
if nilai >= 80:
    print("Kompeten")
elif nilai >= 75:
    print("Lulus")
else:
    print("Latihan")`,
        options: ["Kompeten", "Lulus", "Latihan", "Tidak ada output"],
        answer: "Lulus",
        hint: "78 tidak mencapai 80, tetapi masih mencapai 75.",
      },
      {
        id: "m3-live",
        kind: "live-code",
        title: "Live Coding: Gerbang Kelulusan",
        prompt:
          "Tulis logika kelulusan yang memakai if, elif, else, dan operator and untuk nilai dan absen.",
        starter: `nilai = 86
absen = 96

`,
        requirements: [
          "Ada if dengan operator and.",
          "Ada elif untuk jalur alternatif.",
          "Ada else untuk kondisi terakhir.",
        ],
        checks: [
          { label: "if", pattern: "\\bif\\b" },
          { label: "operator and", pattern: "\\band\\b" },
          { label: "elif dan else", pattern: "\\belif\\b.*\\belse\\b", flags: "s" },
        ],
        successMessage: "Logika kelulusan sudah lengkap.",
        hint: "Mulai dari if nilai >= 80 and absen >= 90:, lalu elif, lalu else.",
      },
    ],
  },
  {
    id: 4,
    slug: "fungsi",
    title: "Modul 4",
    subtitle: "Function Lab",
    focus: "Fungsi, parameter, return, dan reusable code",
    minutes: 60,
    level: "Menengah",
    color: "#ff7a90",
    icon: "function",
    theory: [
      "Fungsi membungkus langkah kerja agar dapat dipakai ulang tanpa menyalin kode.",
      "Parameter adalah input fungsi, sedangkan return mengirimkan hasil kembali ke pemanggil.",
      "Nama fungsi sebaiknya memakai kata kerja yang jelas sesuai tugasnya.",
      "Fungsi yang baik biasanya punya satu tanggung jawab utama, misalnya hitung_rata_rata atau buat_ringkasan.",
      "return berbeda dengan print(). return mengembalikan nilai untuk dipakai lagi, sedangkan print() hanya menampilkan teks ke terminal.",
      "Parameter membuat fungsi lebih fleksibel karena data dapat dikirim dari luar tanpa mengubah isi fungsi.",
      "Variabel di dalam fungsi memiliki scope lokal, sehingga tidak otomatis tersedia di luar fungsi kecuali dikembalikan lewat return.",
      "Sebelum membuat fungsi, tulis dulu contoh input dan output yang diharapkan agar logika fungsi lebih mudah diuji.",
    ],
    skills: ["def", "return", "parameter"],
    code: `def hitung_predikat(nilai):
    if nilai >= 90:
        return "Sangat Baik"
    if nilai >= 80:
        return "Baik"
    return "Perlu Latihan"

print(hitung_predikat(92))`,
    mission:
      "Buat fungsi penilai proyek Python agar guru dapat menilai banyak siswa dengan cepat.",
    games: [
      {
        id: "m4-choice",
        kind: "choice",
        title: "Return Signal",
        prompt: "Keyword apa yang mengirim hasil dari fungsi ke pemanggil?",
        options: ["break", "return", "print", "yielded"],
        answer: "return",
        hint: "Keyword ini membuat fungsi menghasilkan nilai.",
      },
      {
        id: "m4-sequence",
        kind: "sequence",
        title: "Function Forge",
        prompt: "Rakit fungsi yang mengembalikan total harga setelah diskon.",
        options: [
          `return harga - potongan`,
          `potongan = harga * diskon`,
          `def hitung_total(harga, diskon):`,
        ],
        answer: [
          `def hitung_total(harga, diskon):`,
          `potongan = harga * diskon`,
          `return harga - potongan`,
        ],
        hint: "Header fungsi selalu berada di atas, lalu proses, lalu return.",
      },
      {
        id: "m4-locate",
        kind: "locate",
        title: "Parameter Tracker",
        prompt: "Klik baris yang memanggil fungsi dengan jumlah argumen yang salah.",
        codeLines: [
          { id: "1", label: "01", text: `def total(a, b):` },
          { id: "2", label: "02", text: `    return a + b` },
          { id: "3", label: "03", text: `print(total(5, 7))` },
          { id: "4", label: "04", text: `print(total(5))` },
        ],
        answer: "4",
        hint: "Fungsi total butuh dua argumen.",
      },
      {
        id: "m4-output",
        kind: "output",
        title: "Function Output",
        prompt: "Apa output dari pemanggilan fungsi ini?",
        code: `def kali(a, b):
    return a * b

print(kali(3, 4))`,
        options: ["7", "12", "kali(3, 4)", "None"],
        answer: "12",
        hint: "Operator * mengalikan dua angka.",
      },
      {
        id: "m4-live",
        kind: "live-code",
        title: "Live Coding: Fungsi Predikat",
        prompt:
          "Buat fungsi hitung_predikat(nilai) yang memakai parameter, if, dan return.",
        starter: `def hitung_predikat(nilai):
    # tulis logika di sini
    pass

`,
        requirements: [
          "Ada fungsi hitung_predikat dengan parameter nilai.",
          "Ada percabangan if.",
          "Ada minimal satu return.",
        ],
        checks: [
          { label: "def dengan parameter", pattern: "def\\s+hitung_predikat\\s*\\(\\s*nilai\\s*\\)" },
          { label: "if", pattern: "\\bif\\b" },
          { label: "return", pattern: "\\breturn\\b" },
        ],
        successMessage: "Fungsi predikat sudah bisa dipakai ulang.",
        hint: "Gunakan def hitung_predikat(nilai): lalu return \"Baik\" atau predikat lain.",
      },
    ],
  },
  {
    id: 5,
    slug: "oop-python",
    title: "Modul 5",
    subtitle: "Object Oriented Python",
    focus: "Class, object, atribut, method, dan constructor",
    minutes: 65,
    level: "Menengah",
    color: "#b892ff",
    icon: "oop",
    theory: [
      "Class adalah blueprint, sedangkan object adalah instance nyata dari blueprint tersebut.",
      "__init__ dipakai untuk mengisi atribut awal ketika object dibuat.",
      "Method adalah fungsi di dalam class yang mewakili perilaku object.",
      "Parameter self menunjuk ke object yang sedang dipakai, sehingga atribut seperti self.nama tersimpan pada object tersebut.",
      "Satu class dapat menghasilkan banyak object dengan data berbeda, misalnya beberapa object Proyek dengan nama dan stack yang berbeda.",
      "Atribut menyimpan keadaan object, sedangkan method menjelaskan aksi yang dapat dilakukan object.",
      "OOP membantu memodelkan konsep dunia nyata seperti Siswa, Proyek, Course, atau Nilai agar kode lebih terstruktur.",
      "Jika sebuah method hanya mencetak data, pertimbangkan membuatnya mengembalikan string agar hasilnya bisa dipakai ulang oleh bagian program lain.",
    ],
    skills: ["class", "__init__", "method"],
    code: `class Proyek:
    def __init__(self, nama, stack):
        self.nama = nama
        self.stack = stack

    def ringkasan(self):
        return f"{self.nama} memakai {self.stack}"

api = Proyek("LMS")
print(api.ringkasan())`,
    mission:
      "Representasikan proyek siswa sebagai object yang punya nama, stack, dan ringkasan.",
    games: [
      {
        id: "m5-choice",
        kind: "choice",
        title: "OOP Blueprint",
        prompt: "Dalam OOP, class berperan sebagai...",
        options: ["blueprint object", "hasil print", "tipe error", "database"],
        answer: "blueprint object",
        hint: "Object dibuat dari blueprint ini.",
      },
      {
        id: "m5-sequence",
        kind: "sequence",
        title: "Class Builder",
        prompt: "Susun class sederhana agar object bisa menyimpan nama proyek.",
        options: [
          `self.nama = nama`,
          `class Proyek:`,
          `def __init__(self, nama):`,
        ],
        answer: [`class Proyek:`, `def __init__(self, nama):`, `self.nama = nama`],
        hint: "Mulai dari class, lalu constructor, lalu atribut instance.",
      },
      {
        id: "m5-locate",
        kind: "locate",
        title: "Self Detector",
        prompt: "Klik baris method yang salah karena tidak menerima self.",
        codeLines: [
          { id: "1", label: "01", text: `class Siswa:` },
          { id: "2", label: "02", text: `    def __init__(self, nama):` },
          { id: "3", label: "03", text: `        self.nama = nama` },
          { id: "4", label: "04", text: `    def halo():` },
        ],
        answer: "4",
        hint: "Method instance perlu parameter self.",
      },
      {
        id: "m5-output",
        kind: "output",
        title: "Object Reader",
        prompt: "Output apa yang muncul?",
        code: `class Siswa:
    def __init__(self, nama):
        self.nama = nama

raka = Siswa("Raka")
print(raka.nama)`,
        options: ["Siswa", "nama", "Raka", "None"],
        answer: "Raka",
        hint: "Atribut nama diisi saat object dibuat.",
      },
      {
        id: "m5-live",
        kind: "live-code",
        title: "Live Coding: Class Proyek",
        prompt:
          "Buat class Proyek dengan __init__, atribut nama, dan method ringkasan yang mengembalikan teks.",
        starter: `class Proyek:
    # lengkapi class
    pass

`,
        requirements: [
          "Ada class Proyek.",
          "Ada constructor __init__ dengan self.",
          "Ada method ringkasan yang memakai return.",
        ],
        checks: [
          { label: "class Proyek", pattern: "class\\s+Proyek\\s*:" },
          { label: "__init__", pattern: "def\\s+__init__\\s*\\([^\\)]*self" },
          { label: "method ringkasan return", pattern: "def\\s+ringkasan\\s*\\([^\\)]*self[^\\)]*\\).*return", flags: "s" },
        ],
        successMessage: "Class Proyek sudah memiliki state dan behavior.",
        hint: "Gunakan self.nama = nama di __init__, lalu def ringkasan(self): return ...",
      },
    ],
  },
  {
    id: 6,
    slug: "file-io",
    title: "Modul 6",
    subtitle: "File I/O dan Data Persistence",
    focus: "Membaca, menulis, dan mengolah file teks atau CSV",
    minutes: 55,
    level: "Menengah",
    color: "#4dd4ac",
    icon: "file",
    theory: [
      "File I/O membuat program bisa menyimpan data di luar memori sementara.",
      "Context manager with open(...) memastikan file ditutup otomatis setelah dipakai.",
      "Mode r dipakai membaca, w menimpa isi, dan a menambahkan data baru.",
      "Encoding utf-8 membantu file tetap aman untuk teks Indonesia dan karakter umum lain ketika dibaca di perangkat berbeda.",
      "Mode append cocok untuk log aktivitas atau nilai baru karena data lama tetap dipertahankan di akhir file.",
      "Saat membaca CSV sederhana, pisahkan dulu baris dengan splitlines(), lalu pecah kolom dengan split(\",\") jika formatnya konsisten.",
      "Program yang membaca file sebaiknya siap menghadapi FileNotFoundError ketika file belum tersedia.",
      "Sebelum menulis data ke file, rapikan format baris dan tambahkan newline agar data berikutnya tidak menempel pada baris sebelumnya.",
    ],
    skills: ["open()", "with", "read/write"],
    code: `nilai_baru = "Rani,94\\n"

with open("nilai_python.csv", "a", encoding="utf-8") as file:
    file.write(nilai_baru)

with open("nilai_python.csv", "r", encoding="utf-8") as file:
    print(file.read())`,
    mission:
      "Simpan histori nilai Python siswa ke file CSV agar bisa dianalisis ulang.",
    games: [
      {
        id: "m6-choice",
        kind: "choice",
        title: "File Mode Rescue",
        prompt:
          "Guru ingin menambahkan nilai baru tanpa menghapus isi file lama. Mode yang benar adalah...",
        options: [`"r"`, `"w"`, `"a"`, `"x"`],
        answer: `"a"`,
        hint: "Mode append menambahkan data ke akhir file.",
      },
      {
        id: "m6-sequence",
        kind: "sequence",
        title: "Write Pipeline",
        prompt: "Urutkan proses menulis teks ke file.",
        options: [
          `file.write("Rani,94\\n")`,
          `with open("nilai.csv", "a", encoding="utf-8") as file:`,
          `print("Data tersimpan")`,
        ],
        answer: [
          `with open("nilai.csv", "a", encoding="utf-8") as file:`,
          `file.write("Rani,94\\n")`,
          `print("Data tersimpan")`,
        ],
        hint: "File harus dibuka sebelum bisa ditulis.",
      },
      {
        id: "m6-locate",
        kind: "locate",
        title: "Overwrite Alert",
        prompt: "Klik baris yang berisiko menghapus isi file lama.",
        codeLines: [
          { id: "1", label: "01", text: `nilai_baru = "Rani,94\\n"` },
          { id: "2", label: "02", text: `with open("nilai.csv", "w") as file:` },
          { id: "3", label: "03", text: `    file.write(nilai_baru)` },
          { id: "4", label: "04", text: `print("Selesai")` },
        ],
        answer: "2",
        hint: "Mode w menimpa file. Mode a menambahkan data.",
      },
      {
        id: "m6-output",
        kind: "output",
        title: "String Newline",
        prompt: "Apa fungsi \\n pada string berikut?",
        code: `baris = "Rani,94\\n"
print(baris)`,
        options: ["Membuat baris baru", "Menghapus file", "Membuka file", "Membuat list"],
        answer: "Membuat baris baru",
        hint: "\\n adalah newline character.",
      },
      {
        id: "m6-live",
        kind: "live-code",
        title: "Live Coding: Simpan Nilai",
        prompt:
          "Tulis kode untuk membuka nilai_python.csv dengan with open mode append, lalu tulis satu baris nilai.",
        starter: `nilai_baru = "Rani,94\\n"

`,
        requirements: [
          "Memakai with open(...).",
          "Mode file adalah append.",
          "Memanggil write() untuk menyimpan data.",
        ],
        checks: [
          { label: "with open", pattern: "with\\s+open\\s*\\(" },
          { label: "mode append", pattern: "open\\s*\\([^\\)]*[\"']a[\"']" },
          { label: "write", pattern: "\\.write\\s*\\(" },
        ],
        successMessage: "Kode penyimpanan file sudah valid.",
        hint: "Gunakan with open(\"nilai_python.csv\", \"a\", encoding=\"utf-8\") as file:",
      },
    ],
  },
  {
    id: 7,
    slug: "debugging",
    title: "Modul 7",
    subtitle: "Debugging dan Error Handling",
    focus: "Traceback, exception, try-except, dan validasi input",
    minutes: 60,
    level: "Lanjut",
    color: "#ff9f43",
    icon: "debug",
    theory: [
      "Traceback menunjukkan jalur error dan baris kode yang perlu diperiksa.",
      "try-except menjaga program tetap berjalan ketika input atau proses gagal.",
      "Validasi input mengurangi error sebelum program masuk ke proses utama.",
      "Bagian paling bawah traceback biasanya menunjukkan jenis error dan pesan paling dekat dengan penyebab masalah.",
      "Tangkap exception secara spesifik seperti ValueError atau ZeroDivisionError agar bug lain tidak ikut tersembunyi.",
      "Validasi sebaiknya dilakukan sebelum konversi data, misalnya mengecek string angka sebelum diproses dengan int().",
      "except yang terlalu umum tanpa pesan perbaikan akan membuat debugging lebih sulit karena detail error hilang.",
      "Gunakan print debug secukupnya untuk melihat nilai variabel penting, lalu hapus atau rapikan setelah masalah selesai.",
    ],
    skills: ["try", "except", "traceback"],
    code: `try:
    nilai = int(input("Masukkan nilai: "))
    print(100 / nilai)
except ValueError:
    print("Input harus berupa angka.")
except ZeroDivisionError:
    print("Nilai tidak boleh 0.")`,
    mission:
      "Buat program input nilai yang tetap stabil walau pengguna memasukkan data salah.",
    games: [
      {
        id: "m7-choice",
        kind: "choice",
        title: "Exception Shield",
        prompt: "Blok mana yang menangkap error saat kode di try gagal?",
        options: ["catch", "except", "finally only", "error"],
        answer: "except",
        hint: "Python memakai try dan except.",
      },
      {
        id: "m7-sequence",
        kind: "sequence",
        title: "Safe Input Flow",
        prompt: "Susun alur try-except untuk input angka.",
        options: [
          `except ValueError: print("Input harus angka")`,
          `try:`,
          `nilai = int(input("Nilai: "))`,
        ],
        answer: [
          `try:`,
          `nilai = int(input("Nilai: "))`,
          `except ValueError: print("Input harus angka")`,
        ],
        hint: "Kode rawan error berada di dalam try, handler berada di except.",
      },
      {
        id: "m7-locate",
        kind: "locate",
        title: "Error Hunter",
        prompt:
          "Klik baris yang menyebabkan TypeError karena string dijumlahkan dengan integer.",
        codeLines: [
          { id: "1", label: "01", text: `nilai = input("Nilai: ")` },
          { id: "2", label: "02", text: `bonus = 5` },
          { id: "3", label: "03", text: `total = nilai + bonus` },
          { id: "4", label: "04", text: `print(total)` },
        ],
        answer: "3",
        hint: "input() menghasilkan string sampai kamu mengubahnya dengan int().",
      },
      {
        id: "m7-output",
        kind: "output",
        title: "Exception Output",
        prompt: "Jika nilai = 0, pesan mana yang muncul?",
        code: `try:
    nilai = 0
    print(100 / nilai)
except ZeroDivisionError:
    print("Nilai tidak boleh 0")`,
        options: ["100", "0", "Nilai tidak boleh 0", "ValueError"],
        answer: "Nilai tidak boleh 0",
        hint: "Pembagian dengan 0 memicu ZeroDivisionError.",
      },
      {
        id: "m7-live",
        kind: "live-code",
        title: "Live Coding: Input Aman",
        prompt:
          "Tulis kode input nilai yang memakai try, int(), except ValueError, dan except ZeroDivisionError.",
        starter: `try:
    nilai = input("Masukkan nilai: ")

`,
        requirements: [
          "Ada blok try.",
          "Input dikonversi dengan int().",
          "Ada except ValueError dan ZeroDivisionError.",
        ],
        checks: [
          { label: "try", pattern: "\\btry\\s*:" },
          { label: "int", pattern: "int\\s*\\(" },
          { label: "dua except", pattern: "except\\s+ValueError.*except\\s+ZeroDivisionError", flags: "s" },
        ],
        successMessage: "Program input aman sudah menangani error utama.",
        hint: "Konversi nilai = int(input(...)), lalu tulis dua except berbeda.",
      },
    ],
  },
  {
    id: 8,
    slug: "api-project",
    title: "Modul 8",
    subtitle: "API Mini Project",
    focus: "HTTP request, JSON, endpoint, dan integrasi database",
    minutes: 75,
    level: "Lanjut",
    color: "#5ec7ff",
    icon: "api",
    theory: [
      "API adalah jembatan agar aplikasi dapat bertukar data lewat endpoint.",
      "JSON menjadi format umum untuk mengirim data object antar layanan.",
      "Backend yang baik memvalidasi request, menyimpan data, lalu mengembalikan response yang jelas.",
      "HTTP method memberi tahu niat request: GET untuk membaca, POST untuk membuat data, PUT atau PATCH untuk mengubah, dan DELETE untuk menghapus.",
      "Status code membantu client memahami hasil proses, misalnya 200 untuk sukses, 400 untuk request salah, dan 500 untuk error server.",
      "Payload JSON sebaiknya punya key yang konsisten agar frontend, backend, dan database membaca struktur data yang sama.",
      "Jangan percaya seluruh data dari client. Backend tetap perlu mengecek tipe data, field wajib, dan batas nilai sebelum menyimpan.",
      "Response API yang baik berisi pesan yang jelas dan data yang dibutuhkan client, bukan hanya teks sukses atau gagal.",
    ],
    skills: ["JSON", "endpoint", "database"],
    code: `payload = {
    "student_id": "xii-rpl-01",
    "module_id": 8,
    "score": 100,
}

print(payload["student_id"])`,
    mission:
      "Rancang endpoint progress belajar yang bisa disimpan ke Database.",
    games: [
      {
        id: "m8-choice",
        kind: "choice",
        title: "API Launch Codes",
        prompt:
          "Endpoint berhasil membuat progress baru. Status HTTP yang paling tepat adalah...",
        options: ["200 OK", "201 Created", "404 Not Found", "500 Internal Server Error"],
        answer: "201 Created",
        hint: "Gunakan status khusus ketika resource baru berhasil dibuat.",
      },
      {
        id: "m8-sequence",
        kind: "sequence",
        title: "Payload Builder",
        prompt: "Susun payload progress sebelum dikirim ke API.",
        options: [
          `payload["score"] = 100`,
          `payload = {}`,
          `payload["student_id"] = "xii-rpl-01"`,
        ],
        answer: [
          `payload = {}`,
          `payload["student_id"] = "xii-rpl-01"`,
          `payload["score"] = 100`,
        ],
        hint: "Dictionary kosong dibuat dulu, baru diisi key-value.",
      },
      {
        id: "m8-locate",
        kind: "locate",
        title: "Endpoint Bug Hunt",
        prompt: "Klik baris yang salah karena method membuat data seharusnya POST.",
        codeLines: [
          { id: "1", label: "01", text: `endpoint = "/api/progress"` },
          { id: "2", label: "02", text: `method = "GET"` },
          { id: "3", label: "03", text: `payload = {"score": 100}` },
          { id: "4", label: "04", text: `print(endpoint, method)` },
        ],
        answer: "2",
        hint: "Membuat data baru biasanya memakai POST.",
      },
      {
        id: "m8-output",
        kind: "output",
        title: "JSON Key Reader",
        prompt: "Output apa yang muncul?",
        code: `payload = {"module_id": 8, "score": 100}
print(payload["score"])`,
        options: ["8", "100", "score", "KeyError"],
        answer: "100",
        hint: "Key score berisi nilai 100.",
      },
      {
        id: "m8-live",
        kind: "live-code",
        title: "Live Coding: Payload Progress",
        prompt:
          "Buat dictionary payload berisi student_id, module_id, score, lalu print score-nya.",
        starter: `payload = {

}

`,
        requirements: [
          "Ada dictionary payload.",
          "Ada key student_id, module_id, dan score.",
          "Ada print() yang membaca payload.",
        ],
        checks: [
          { label: "payload dictionary", pattern: "payload\\s*=\\s*\\{" },
          { label: "tiga key utama", pattern: "[\"']student_id[\"'].*[\"']module_id[\"'].*[\"']score[\"']", flags: "s" },
          { label: "print payload", pattern: "print\\s*\\([^\\)]*payload" },
        ],
        successMessage: "Payload progress siap dikirim ke endpoint.",
        hint: "Contoh key: \"student_id\": \"xii-rpl-01\", \"module_id\": 8, \"score\": 100.",
      },
    ],
  },
];

export const flutterModules: LmsModule[] = [
  {
    id: 101,
    slug: "flutter-fundamental",
    title: "Modul 1",
    subtitle: "Flutter Fundamental",
    focus: "Workspace, project setup, pages, dan responsive canvas",
    minutes: 45,
    level: "Dasar",
    color: "#54c5f8",
    icon: "syntax",
    theory: [
      "Flutter adalah visual app builder untuk membuat aplikasi Flutter tanpa menulis semua kode dari nol.",
      "Struktur awal aplikasi biasanya dimulai dari project, page, layout, component, dan navigation flow.",
      "Responsive canvas membantu memastikan tampilan tetap rapi di ukuran layar berbeda.",
      "Sebelum membuat halaman, tentukan tujuan aplikasi, daftar user, dan alur utama agar struktur project tidak berubah-ubah di tengah pengerjaan.",
      "Nama page sebaiknya konsisten seperti SplashPage, LoginPage, dan HomePage supaya action navigasi mudah dicari.",
      "Gunakan tema warna, font, dan aset sejak awal agar UI antar halaman terasa sebagai satu aplikasi yang sama.",
      "Preview setiap halaman pada ukuran mobile dan tablet karena layout yang bagus di desktop belum tentu nyaman di layar kecil.",
      "Project awal yang rapi memudahkan modul berikutnya ketika kamu mulai menambah component, state, dan integrasi Firebase.",
    ],
    skills: ["project setup", "page", "responsive"],
    code: `Project: RPL Student App
Pages:
  - SplashPage
  - LoginPage
  - HomePage

Responsive rules:
  mobile: single column
  tablet: two columns`,
    mission:
      "Siapkan project Flutter untuk aplikasi profil siswa XII RPL dengan halaman Splash, Login, dan Home.",
    games: [
      {
        id: "ff1-choice",
        kind: "choice",
        title: "Builder Scanner",
        prompt: "Bagian Flutter yang dipakai untuk menyusun UI secara visual adalah...",
        options: ["Canvas", "DNS Zone", "Terminal Linux", "Package Registry"],
        answer: "Canvas",
        hint: "Canvas adalah area utama untuk menaruh widget dan melihat tampilan aplikasi.",
      },
      {
        id: "ff1-sequence",
        kind: "sequence",
        title: "Project Starter",
        prompt: "Susun langkah awal membuat project Flutter.",
        options: ["Buat halaman pertama", "Pilih template atau blank app", "Buat project baru"],
        answer: ["Buat project baru", "Pilih template atau blank app", "Buat halaman pertama"],
        hint: "Project dibuat dulu, baru memilih dasar app, lalu menambahkan halaman.",
      },
      {
        id: "ff1-locate",
        kind: "locate",
        title: "Page Flow Bug",
        prompt: "Klik baris yang membuat alur halaman tidak lengkap.",
        codeLines: [
          { id: "1", label: "01", text: "Project dibuat dengan nama RPL Student App" },
          { id: "2", label: "02", text: "SplashPage dibuat sebagai halaman pembuka" },
          { id: "3", label: "03", text: "HomePage dihapus tetapi tetap dijadikan target navigasi" },
          { id: "4", label: "04", text: "LoginPage disiapkan untuk autentikasi" },
        ],
        answer: "3",
        hint: "Target navigasi harus mengarah ke page yang masih ada.",
      },
      {
        id: "ff1-output",
        kind: "output",
        title: "Page Counter",
        prompt: "Berapa jumlah page aktif pada konfigurasi ini?",
        code: `pages = ["SplashPage", "LoginPage", "HomePage"]
print(len(pages))`,
        options: ["1", "2", "3", "Error"],
        answer: "3",
        hint: "List berisi tiga nama page.",
      },
      {
        id: "ff1-live",
        kind: "live-code",
        title: "Live Config: Starter App",
        prompt: "Tulis konfigurasi teks yang memuat SplashPage, LoginPage, dan HomePage.",
        starter: `project = "RPL Student App"
pages = [

]
`,
        requirements: [
          "Ada nama project RPL Student App.",
          "Ada SplashPage.",
          "Ada LoginPage dan HomePage.",
        ],
        checks: [
          { label: "project", pattern: "RPL Student App" },
          { label: "SplashPage", pattern: "SplashPage" },
          { label: "Login dan Home", pattern: "LoginPage.*HomePage|HomePage.*LoginPage", flags: "s" },
        ],
        successMessage: "Konfigurasi starter app Flutter sudah lengkap.",
        hint: "Isi pages dengan tiga string: SplashPage, LoginPage, dan HomePage.",
      },
    ],
  },
  {
    id: 102,
    slug: "flutter-ui-layout",
    title: "Modul 2",
    subtitle: "UI Layout System",
    focus: "Widget tree, container, row, column, spacing, dan component",
    minutes: 55,
    level: "Dasar",
    color: "#37e5a5",
    icon: "data",
    theory: [
      "Widget tree menentukan hubungan parent dan child pada tampilan aplikasi.",
      "Column menyusun child secara vertikal, sedangkan Row menyusun child secara horizontal.",
      "Component dipakai untuk bagian UI yang berulang seperti card siswa, navbar, atau tombol aksi.",
      "Setiap widget punya batas ukuran dari parent-nya. Jika layout overflow, periksa constraint, padding, dan ukuran child terlebih dahulu.",
      "Padding memberi ruang di dalam elemen, sedangkan margin atau spacing memberi jarak antar elemen.",
      "UI yang berulang sebaiknya diubah menjadi component agar perubahan desain cukup dilakukan di satu tempat.",
      "Bangun layout dari mobile terlebih dahulu, lalu sesuaikan untuk tablet atau desktop dengan grid, wrap, atau responsive visibility.",
      "Hindari tree yang terlalu dalam tanpa alasan. Jika satu bagian UI mulai panjang, pecah menjadi component kecil yang punya nama jelas.",
    ],
    skills: ["widget tree", "row/column", "component"],
    code: `HomePage
  Column
    HeaderProfile
    StudentStatsRow
    ProjectCardList`,
    mission:
      "Bangun struktur HomePage berisi header profil, ringkasan statistik, dan daftar project siswa.",
    games: [
      {
        id: "ff2-choice",
        kind: "choice",
        title: "Layout Direction",
        prompt: "Widget yang paling tepat untuk menyusun konten dari atas ke bawah adalah...",
        options: ["Column", "Row", "Stack only", "Divider"],
        answer: "Column",
        hint: "Column menyusun child secara vertikal.",
      },
      {
        id: "ff2-sequence",
        kind: "sequence",
        title: "Widget Tree Builder",
        prompt: "Susun widget tree HomePage dari parent ke child.",
        options: ["ProjectCardList", "Column", "HomePage"],
        answer: ["HomePage", "Column", "ProjectCardList"],
        hint: "Mulai dari page, lalu layout parent, lalu child.",
      },
      {
        id: "ff2-locate",
        kind: "locate",
        title: "Spacing Radar",
        prompt: "Klik baris yang berisiko membuat UI terlalu rapat.",
        codeLines: [
          { id: "1", label: "01", text: "Container padding = 16" },
          { id: "2", label: "02", text: "Column spacing = 0 untuk semua section" },
          { id: "3", label: "03", text: "Card radius = 8" },
          { id: "4", label: "04", text: "Text maxLines = 2" },
        ],
        answer: "2",
        hint: "Section utama butuh jarak agar mudah dipindai.",
      },
      {
        id: "ff2-output",
        kind: "output",
        title: "Layout Count",
        prompt: "Berapa child langsung milik Column?",
        code: `Column children:
- HeaderProfile
- StudentStatsRow
- ProjectCardList`,
        options: ["1", "2", "3", "4"],
        answer: "3",
        hint: "Hitung item yang berada tepat di bawah Column.",
      },
      {
        id: "ff2-live",
        kind: "live-code",
        title: "Live Config: Home Layout",
        prompt: "Tulis struktur layout yang memuat Column, HeaderProfile, StudentStatsRow, dan ProjectCardList.",
        starter: `HomePage
  # lengkapi struktur
`,
        requirements: [
          "Ada Column.",
          "Ada HeaderProfile.",
          "Ada StudentStatsRow dan ProjectCardList.",
        ],
        checks: [
          { label: "Column", pattern: "Column" },
          { label: "HeaderProfile", pattern: "HeaderProfile" },
          { label: "Stats dan Card", pattern: "StudentStatsRow.*ProjectCardList|ProjectCardList.*StudentStatsRow", flags: "s" },
        ],
        successMessage: "Struktur HomePage sudah siap dibuat di Flutter.",
        hint: "Tulis child di bawah Column dengan indentasi sederhana.",
      },
    ],
  },
  {
    id: 103,
    slug: "flutter-navigation",
    title: "Modul 3",
    subtitle: "Navigation and App Flow",
    focus: "Initial page, actions, routes, bottom navigation, dan guards",
    minutes: 55,
    level: "Menengah",
    color: "#ffd166",
    icon: "flow",
    theory: [
      "Initial page menentukan halaman pertama yang dibuka ketika aplikasi berjalan.",
      "Action digunakan untuk berpindah halaman, membuka dialog, atau menjalankan proses setelah event.",
      "Navigation guard membantu mengarahkan user sesuai status login atau kelengkapan data.",
      "Route atau nama halaman harus konsisten dengan target action. Jika page dihapus atau diganti nama, action navigasi perlu diperbarui.",
      "Kirim parameter hanya jika halaman tujuan benar-benar membutuhkannya, misalnya projectId untuk membuka detail proyek.",
      "Bottom navigation cocok untuk halaman utama yang setara, seperti Home, Project, dan Profile, bukan untuk alur form bertahap.",
      "Back navigation perlu dipikirkan agar user tidak kembali ke halaman login setelah berhasil masuk.",
      "Flow aplikasi yang baik dapat digambar sebagai peta halaman sebelum action dibuat, sehingga bug navigasi lebih mudah ditemukan.",
    ],
    skills: ["actions", "routes", "guards"],
    code: `On App Start:
  if authUser != null -> HomePage
  else -> LoginPage

BottomNav:
  Home | Projects | Profile`,
    mission:
      "Rancang alur aplikasi dari Splash ke Login atau Home, lalu buat bottom navigation tiga tab.",
    games: [
      {
        id: "ff3-choice",
        kind: "choice",
        title: "Route Guard",
        prompt: "Kondisi apa yang paling tepat untuk mengirim user login langsung ke HomePage?",
        options: ["authUser != null", "theme == dark", "button disabled", "padding > 16"],
        answer: "authUser != null",
        hint: "Status autentikasi menentukan user sudah login atau belum.",
      },
      {
        id: "ff3-sequence",
        kind: "sequence",
        title: "Auth Flow",
        prompt: "Susun alur navigasi awal aplikasi.",
        options: ["HomePage jika sudah login", "SplashPage dibuka", "LoginPage jika belum login"],
        answer: ["SplashPage dibuka", "HomePage jika sudah login", "LoginPage jika belum login"],
        hint: "Splash mengecek state, lalu bercabang ke tujuan yang sesuai.",
      },
      {
        id: "ff3-locate",
        kind: "locate",
        title: "Navigation Loop",
        prompt: "Klik baris yang bisa membuat user berputar kembali ke login setelah berhasil masuk.",
        codeLines: [
          { id: "1", label: "01", text: "Login success action: Navigate to HomePage" },
          { id: "2", label: "02", text: "HomePage on load: Navigate to LoginPage tanpa cek auth" },
          { id: "3", label: "03", text: "Profile tab: Navigate to ProfilePage" },
          { id: "4", label: "04", text: "Logout action: Clear auth then LoginPage" },
        ],
        answer: "2",
        hint: "Navigasi otomatis harus punya kondisi agar tidak membuat loop.",
      },
      {
        id: "ff3-output",
        kind: "output",
        title: "Tab Reader",
        prompt: "Tab mana yang aktif jika index bernilai 1?",
        code: `tabs = ["Home", "Projects", "Profile"]
print(tabs[1])`,
        options: ["Home", "Projects", "Profile", "Error"],
        answer: "Projects",
        hint: "Index list dimulai dari 0.",
      },
      {
        id: "ff3-live",
        kind: "live-code",
        title: "Live Config: Navigation Guard",
        prompt: "Tulis rule yang memuat authUser, HomePage, dan LoginPage.",
        starter: `if authUser:
  navigate = ""
else:
  navigate = ""
`,
        requirements: [
          "Ada authUser.",
          "Ada HomePage.",
          "Ada LoginPage.",
        ],
        checks: [
          { label: "authUser", pattern: "authUser" },
          { label: "HomePage", pattern: "HomePage" },
          { label: "LoginPage", pattern: "LoginPage" },
        ],
        successMessage: "Navigation guard Flutter sudah jelas.",
        hint: "Isi navigate dengan HomePage saat authUser ada dan LoginPage saat kosong.",
      },
    ],
  },
  {
    id: 104,
    slug: "flutter-state",
    title: "Modul 4",
    subtitle: "State Management",
    focus: "App state, page state, component state, dan conditional visibility",
    minutes: 60,
    level: "Menengah",
    color: "#ff7a90",
    icon: "function",
    theory: [
      "App state menyimpan nilai yang perlu diakses lintas halaman.",
      "Page state cocok untuk data sementara yang hanya dipakai di satu halaman.",
      "Conditional visibility membuat UI muncul atau hilang berdasarkan nilai state.",
      "Pilih scope state dari kebutuhan datanya. Jika hanya dipakai di satu form, page state lebih sederhana daripada app state.",
      "Perubahan state akan memengaruhi tampilan yang bergantung pada nilai tersebut, seperti tombol aktif, filter kelas, atau teks status.",
      "Nilai awal state penting agar UI tidak kosong tanpa alasan ketika halaman pertama kali dibuka.",
      "Gunakan state untuk membedakan loading, empty, success, dan error agar user tahu apa yang sedang terjadi.",
      "Hindari menyimpan data yang sama di banyak state berbeda karena perubahan satu nilai bisa membuat UI tidak sinkron.",
    ],
    skills: ["app state", "page state", "visibility"],
    code: `AppState:
  selectedClass = "XII RPL"
  isDarkMode = true

HomePage:
  showEmptyState = projectCount == 0`,
    mission:
      "Buat state untuk filter kelas, mode tampilan, dan empty state daftar project.",
    games: [
      {
        id: "ff4-choice",
        kind: "choice",
        title: "State Scope",
        prompt: "State yang perlu dipakai lintas banyak page sebaiknya disimpan sebagai...",
        options: ["App State", "Page Padding", "Border Radius", "Asset Folder"],
        answer: "App State",
        hint: "App State tersedia lebih luas daripada Page State.",
      },
      {
        id: "ff4-sequence",
        kind: "sequence",
        title: "State Update Flow",
        prompt: "Susun alur update state filter kelas.",
        options: ["Refresh daftar project", "User memilih kelas", "Update selectedClass"],
        answer: ["User memilih kelas", "Update selectedClass", "Refresh daftar project"],
        hint: "Event user mengubah state, lalu UI bereaksi.",
      },
      {
        id: "ff4-locate",
        kind: "locate",
        title: "Scope Mismatch",
        prompt: "Klik baris yang salah karena nilai dibutuhkan lintas page tetapi disimpan terlalu lokal.",
        codeLines: [
          { id: "1", label: "01", text: "selectedClass dipakai di HomePage dan ProjectPage" },
          { id: "2", label: "02", text: "selectedClass disimpan sebagai Page State HomePage saja" },
          { id: "3", label: "03", text: "isDarkMode disimpan sebagai App State" },
          { id: "4", label: "04", text: "searchText disimpan sebagai Page State" },
        ],
        answer: "2",
        hint: "Data lintas page sebaiknya bukan Page State di satu halaman saja.",
      },
      {
        id: "ff4-output",
        kind: "output",
        title: "Visibility Logic",
        prompt: "Jika projectCount = 0, apa nilai showEmptyState?",
        code: `projectCount = 0
showEmptyState = projectCount == 0`,
        options: ["true", "false", "null", "HomePage"],
        answer: "true",
        hint: "0 == 0 bernilai benar.",
      },
      {
        id: "ff4-live",
        kind: "live-code",
        title: "Live Config: App State",
        prompt: "Tulis konfigurasi yang memuat selectedClass, isDarkMode, dan showEmptyState.",
        starter: `AppState:

HomePage:

`,
        requirements: [
          "Ada selectedClass.",
          "Ada isDarkMode.",
          "Ada showEmptyState.",
        ],
        checks: [
          { label: "selectedClass", pattern: "selectedClass" },
          { label: "isDarkMode", pattern: "isDarkMode" },
          { label: "showEmptyState", pattern: "showEmptyState" },
        ],
        successMessage: "State utama aplikasi sudah terdefinisi.",
        hint: "Tuliskan selectedClass dan isDarkMode di AppState, showEmptyState di HomePage.",
      },
    ],
  },
  {
    id: 105,
    slug: "flutter-firebase",
    title: "Modul 5",
    subtitle: "Firebase Integration",
    focus: "Authentication, Firestore collections, rules, dan query",
    minutes: 70,
    level: "Menengah",
    color: "#ffa726",
    icon: "data",
    theory: [
      "Firebase Authentication mengelola proses login, register, dan identitas user.",
      "Firestore menyimpan data dalam collection dan document.",
      "Security rules membatasi siapa yang boleh membaca atau menulis data.",
      "UID dari Authentication sering dipakai sebagai penghubung antara user login dan document profil di Firestore.",
      "Collection sebaiknya diberi nama jelas seperti users, projects, atau scores agar query mudah dipahami.",
      "Query perlu dirancang sesuai kebutuhan halaman, misalnya mengambil project berdasarkan ownerId atau kelas siswa.",
      "Rules bukan pengganti validasi UI. Walaupun tombol disembunyikan, rules tetap harus melindungi data dari request yang tidak sah.",
      "Siapkan data contoh saat development supaya empty state, list, detail, dan permission dapat diuji sebelum aplikasi dipakai siswa.",
    ],
    skills: ["auth", "firestore", "rules"],
    code: `collections:
  users/{userId}
  projects/{projectId}

project fields:
  title: string
  ownerId: auth.uid
  createdAt: timestamp`,
    mission:
      "Hubungkan Flutter ke Firebase Auth dan Firestore untuk menyimpan data project siswa.",
    games: [
      {
        id: "ff5-choice",
        kind: "choice",
        title: "Firestore Unit",
        prompt: "Unit data di dalam collection Firestore disebut...",
        options: ["Document", "Widget", "Canvas", "Breakpoint"],
        answer: "Document",
        hint: "Collection berisi document.",
      },
      {
        id: "ff5-sequence",
        kind: "sequence",
        title: "Firebase Setup",
        prompt: "Susun urutan integrasi Firebase di Flutter.",
        options: ["Aktifkan Auth dan Firestore", "Hubungkan project Firebase", "Buat collection schema"],
        answer: ["Hubungkan project Firebase", "Aktifkan Auth dan Firestore", "Buat collection schema"],
        hint: "Project harus terhubung sebelum fitur dan schema dipakai.",
      },
      {
        id: "ff5-locate",
        kind: "locate",
        title: "Rules Alert",
        prompt: "Klik baris rules yang terlalu terbuka untuk aplikasi siswa.",
        codeLines: [
          { id: "1", label: "01", text: "users: user hanya membaca dokumennya sendiri" },
          { id: "2", label: "02", text: "projects: allow read, write: if true" },
          { id: "3", label: "03", text: "projects.ownerId wajib sama dengan auth.uid saat create" },
          { id: "4", label: "04", text: "createdAt diisi server timestamp" },
        ],
        answer: "2",
        hint: "allow if true membuka akses untuk semua orang.",
      },
      {
        id: "ff5-output",
        kind: "output",
        title: "Owner Field",
        prompt: "Field mana yang dipakai untuk menghubungkan project dengan user login?",
        code: `project = {
  title: "Portfolio App",
  ownerId: auth.uid
}`,
        options: ["title", "ownerId", "Portfolio App", "collection"],
        answer: "ownerId",
        hint: "ownerId menyimpan uid user pemilik data.",
      },
      {
        id: "ff5-live",
        kind: "live-code",
        title: "Live Config: Firestore Schema",
        prompt: "Tulis schema project yang punya title, ownerId, dan createdAt.",
        starter: `projects:
  fields:

`,
        requirements: [
          "Ada collection projects.",
          "Ada field title dan ownerId.",
          "Ada field createdAt.",
        ],
        checks: [
          { label: "projects", pattern: "projects" },
          { label: "title ownerId", pattern: "title.*ownerId|ownerId.*title", flags: "s" },
          { label: "createdAt", pattern: "createdAt" },
        ],
        successMessage: "Schema Firestore project sudah siap.",
        hint: "Gunakan field title: string, ownerId: auth.uid, createdAt: timestamp.",
      },
    ],
  },
  {
    id: 106,
    slug: "flutter-actions-api",
    title: "Modul 6",
    subtitle: "Actions and API Calls",
    focus: "Button action, backend query, REST API, JSON path, dan loading state",
    minutes: 70,
    level: "Lanjut",
    color: "#5ec7ff",
    icon: "api",
    theory: [
      "Action chain menjalankan beberapa langkah setelah event seperti tap, submit, atau page load.",
      "API call menghubungkan aplikasi dengan layanan eksternal menggunakan endpoint HTTP.",
      "Loading dan error state menjaga pengalaman user tetap jelas saat data sedang diproses.",
      "Urutan action penting. Validasi form sebaiknya berjalan sebelum create document atau API call agar data salah tidak terkirim.",
      "JSON path dipakai untuk mengambil bagian tertentu dari response, jadi struktur response harus diketahui sebelum mapping data.",
      "Tombol submit sebaiknya dinonaktifkan saat loading agar user tidak mengirim request ganda.",
      "Jika API gagal, tampilkan pesan yang membantu user memperbaiki langkah berikutnya, bukan hanya menampilkan gagal.",
      "Pisahkan action yang mengubah data dan action yang hanya membaca data agar flow lebih mudah diuji.",
    ],
    skills: ["actions", "REST API", "JSON path"],
    code: `Button Submit:
  Validate Form
  Create Firestore Document
  Show Snackbar
  Navigate to DetailPage`,
    mission:
      "Buat action tombol submit untuk validasi form, simpan data, tampilkan snackbar, lalu masuk detail page.",
    games: [
      {
        id: "ff6-choice",
        kind: "choice",
        title: "Action Chain",
        prompt: "Urutan beberapa aksi yang berjalan setelah tombol diklik disebut...",
        options: ["Action Chain", "Color Palette", "Asset Export", "Grid Gap"],
        answer: "Action Chain",
        hint: "Flutter menyebut rangkaian aksi sebagai action chain.",
      },
      {
        id: "ff6-sequence",
        kind: "sequence",
        title: "Submit Pipeline",
        prompt: "Susun action submit form yang aman.",
        options: ["Navigate to DetailPage", "Validate Form", "Create Firestore Document"],
        answer: ["Validate Form", "Create Firestore Document", "Navigate to DetailPage"],
        hint: "Validasi dulu, simpan data, lalu pindah halaman.",
      },
      {
        id: "ff6-locate",
        kind: "locate",
        title: "API Method Bug",
        prompt: "Klik baris yang salah untuk membuat data baru lewat REST API.",
        codeLines: [
          { id: "1", label: "01", text: "Endpoint: /projects" },
          { id: "2", label: "02", text: "Method: GET untuk membuat project baru" },
          { id: "3", label: "03", text: "Body: title dan ownerId" },
          { id: "4", label: "04", text: "Success state: show snackbar" },
        ],
        answer: "2",
        hint: "Membuat data baru biasanya memakai POST.",
      },
      {
        id: "ff6-output",
        kind: "output",
        title: "Status Reader",
        prompt: "Status HTTP yang umum untuk data berhasil dibuat adalah...",
        code: `POST /projects
response.status = 201`,
        options: ["200 OK", "201 Created", "404 Not Found", "500 Error"],
        answer: "201 Created",
        hint: "201 berarti resource baru berhasil dibuat.",
      },
      {
        id: "ff6-live",
        kind: "live-code",
        title: "Live Config: Submit Action",
        prompt: "Tulis action chain yang memuat Validate Form, Create Firestore Document, dan Navigate to DetailPage.",
        starter: `SubmitButton actions:

`,
        requirements: [
          "Ada Validate Form.",
          "Ada Create Firestore Document.",
          "Ada Navigate to DetailPage.",
        ],
        checks: [
          { label: "validate", pattern: "Validate Form" },
          { label: "create document", pattern: "Create Firestore Document" },
          { label: "navigate", pattern: "Navigate.*DetailPage", flags: "s" },
        ],
        successMessage: "Action submit sudah end-to-end.",
        hint: "Tuliskan tiga action secara berurutan di bawah SubmitButton actions.",
      },
    ],
  },
  {
    id: 107,
    slug: "flutter-custom-code",
    title: "Modul 7",
    subtitle: "Custom Code and Components",
    focus: "Custom functions, custom widgets, pubspec dependencies, dan reusable logic",
    minutes: 75,
    level: "Lanjut",
    color: "#b892ff",
    icon: "oop",
    theory: [
      "Custom function cocok untuk logika kecil yang mengembalikan nilai.",
      "Custom widget dipakai ketika UI atau behavior tidak tersedia dari widget bawaan.",
      "Dependency tambahan perlu dikelola hati-hati agar build aplikasi tetap stabil.",
      "Custom function sebaiknya bersifat pure jika memungkinkan: input masuk, hasil keluar, tanpa mengubah state tersembunyi.",
      "Custom widget perlu menerima parameter yang jelas agar bisa dipakai di banyak halaman tanpa menyalin desain.",
      "Sebelum menambah dependency, cek kebutuhan fitur, ukuran package, kompatibilitas, dan apakah Flutter sudah menyediakan alternatif bawaan.",
      "Null safety perlu diperhatikan pada custom code agar aplikasi tidak crash ketika data dari API atau Firebase belum tersedia.",
      "Dokumentasikan cara memakai custom code singkat di nama parameter atau komentar agar teman satu tim dapat memakainya dengan benar.",
    ],
    skills: ["custom function", "custom widget", "dependency"],
    code: `String formatScore(int score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  return "C";
}`,
    mission:
      "Buat custom function untuk mengubah nilai project menjadi predikat A, B, atau C.",
    games: [
      {
        id: "ff7-choice",
        kind: "choice",
        title: "Custom Function Fit",
        prompt: "Untuk logika kecil yang mengubah score menjadi predikat, fitur yang paling tepat adalah...",
        options: ["Custom Function", "Bottom Sheet", "Image Asset", "Theme Font"],
        answer: "Custom Function",
        hint: "Custom function menerima input dan mengembalikan output.",
      },
      {
        id: "ff7-sequence",
        kind: "sequence",
        title: "Function Builder",
        prompt: "Susun logika predikat score.",
        options: [`return "C"`, `if score >= 90 return "A"`, `if score >= 80 return "B"`],
        answer: [`if score >= 90 return "A"`, `if score >= 80 return "B"`, `return "C"`],
        hint: "Cek nilai tertinggi dulu agar predikat A tidak tertimpa.",
      },
      {
        id: "ff7-locate",
        kind: "locate",
        title: "Dependency Risk",
        prompt: "Klik baris yang paling berisiko membuat build gagal.",
        codeLines: [
          { id: "1", label: "01", text: "Custom function memakai input score bertipe int" },
          { id: "2", label: "02", text: "Dependency ditambahkan tanpa mengecek kompatibilitas Flutter" },
          { id: "3", label: "03", text: "Return type function adalah String" },
          { id: "4", label: "04", text: "Function diuji dengan score 90 dan 75" },
        ],
        answer: "2",
        hint: "Dependency yang tidak kompatibel sering membuat build error.",
      },
      {
        id: "ff7-output",
        kind: "output",
        title: "Predicate Output",
        prompt: "Apa predikat untuk score 85?",
        code: `if score >= 90 -> A
if score >= 80 -> B
else -> C

score = 85`,
        options: ["A", "B", "C", "Error"],
        answer: "B",
        hint: "85 tidak mencapai 90, tetapi mencapai 80.",
      },
      {
        id: "ff7-live",
        kind: "live-code",
        title: "Live Code: formatScore",
        prompt: "Tulis function formatScore yang menerima score dan mengembalikan A, B, atau C.",
        starter: `String formatScore(int score) {

}
`,
        requirements: [
          "Ada nama formatScore.",
          "Ada pengecekan score >= 90.",
          "Ada return A, B, dan C.",
        ],
        checks: [
          { label: "formatScore", pattern: "formatScore" },
          { label: "score 90", pattern: "score\\s*>=\\s*90" },
          { label: "return A B C", pattern: "return\\s+[\"']A[\"'].*return\\s+[\"']B[\"'].*return\\s+[\"']C[\"']", flags: "s" },
        ],
        successMessage: "Custom function predikat sudah valid.",
        hint: "Gunakan if score >= 90 return \"A\"; if score >= 80 return \"B\"; return \"C\";",
      },
    ],
  },
  {
    id: 108,
    slug: "flutter-deploy",
    title: "Modul 8",
    subtitle: "Testing, Build, and Deployment",
    focus: "Preview, testing, APK build, web deploy, dan release checklist",
    minutes: 80,
    level: "Lanjut",
    color: "#4dd4ac",
    icon: "debug",
    theory: [
      "Preview dipakai untuk mengecek flow dan UI sebelum build final.",
      "Testing perlu mencakup login, CRUD data, empty state, error state, dan responsive layout.",
      "Release checklist membantu memastikan environment, rules, dan aset sudah siap sebelum deploy.",
      "Uji aplikasi di beberapa ukuran layar dan perangkat karena masalah spacing, keyboard, dan scroll sering baru terlihat setelah preview nyata.",
      "Mode release dapat berbeda dari preview, terutama pada permission, asset, koneksi API, dan konfigurasi Firebase.",
      "Sebelum build, pastikan nama aplikasi, icon, splash screen, package id, dan versi sudah sesuai dengan target rilis.",
      "Catat bug yang ditemukan saat testing dalam checklist supaya perbaikan dapat diverifikasi ulang sebelum deploy.",
      "Setelah deploy, simpan catatan versi dan perubahan utama agar tim tahu build mana yang sedang dipakai pengguna.",
    ],
    skills: ["testing", "build", "deployment"],
    code: `Release checklist:
  Auth flow tested
  Firestore rules reviewed
  Android build passed
  Web deploy verified`,
    mission:
      "Siapkan checklist rilis aplikasi Flutter dari preview sampai build Android dan web deploy.",
    games: [
      {
        id: "ff8-choice",
        kind: "choice",
        title: "Release Gate",
        prompt: "Sebelum publish, hal yang wajib dicek untuk keamanan data Firestore adalah...",
        options: ["Security rules", "Button radius", "Font preview", "Icon size"],
        answer: "Security rules",
        hint: "Rules menentukan siapa yang boleh membaca dan menulis data.",
      },
      {
        id: "ff8-sequence",
        kind: "sequence",
        title: "Release Pipeline",
        prompt: "Susun pipeline rilis aplikasi Flutter.",
        options: ["Build APK atau deploy web", "Preview dan test flow", "Review Firebase rules"],
        answer: ["Preview dan test flow", "Review Firebase rules", "Build APK atau deploy web"],
        hint: "Uji dulu, cek keamanan, baru build atau deploy.",
      },
      {
        id: "ff8-locate",
        kind: "locate",
        title: "Release Blocker",
        prompt: "Klik baris yang harus diperbaiki sebelum deploy.",
        codeLines: [
          { id: "1", label: "01", text: "Login berhasil untuk user valid" },
          { id: "2", label: "02", text: "Firestore rules masih allow read, write: if true" },
          { id: "3", label: "03", text: "Empty state project tampil dengan benar" },
          { id: "4", label: "04", text: "Build Android berhasil" },
        ],
        answer: "2",
        hint: "Rules terbuka adalah blocker keamanan.",
      },
      {
        id: "ff8-output",
        kind: "output",
        title: "Checklist Count",
        prompt: "Berapa item checklist yang sudah passed?",
        code: `passed = ["auth", "rules", "android", "web"]
print(len(passed))`,
        options: ["2", "3", "4", "5"],
        answer: "4",
        hint: "List berisi empat item.",
      },
      {
        id: "ff8-live",
        kind: "live-code",
        title: "Live Config: Release Checklist",
        prompt: "Tulis checklist yang memuat Auth flow tested, Firestore rules reviewed, dan Android build passed.",
        starter: `Release checklist:

`,
        requirements: [
          "Ada Auth flow tested.",
          "Ada Firestore rules reviewed.",
          "Ada Android build passed.",
        ],
        checks: [
          { label: "auth", pattern: "Auth flow tested" },
          { label: "rules", pattern: "Firestore rules reviewed" },
          { label: "android", pattern: "Android build passed" },
        ],
        successMessage: "Checklist rilis Flutter sudah siap.",
        hint: "Tuliskan tiga item checklist utama sebelum deploy.",
      },
    ],
  },
];

export const javascriptModules: LmsModule[] = [
  {
    id: 201,
    slug: "javascript-fundamental",
    title: "Modul 1",
    subtitle: "JavaScript Fundamental",
    focus: "Sintaks, variabel, tipe data dasar, dan output",
    minutes: 45,
    level: "Dasar",
    color: "#f7df1e",
    icon: "syntax",
    theory: [
      "JavaScript menjalankan instruksi dari atas ke bawah, sehingga urutan deklarasi dan pemanggilan kode memengaruhi hasil program.",
      "Variabel dapat dibuat dengan let dan const. Gunakan const untuk nilai yang tidak diganti, dan let untuk nilai yang berubah.",
      "String, number, boolean, null, dan undefined adalah tipe data dasar yang sering muncul dalam program JavaScript.",
      "console.log() dipakai untuk menampilkan data ke console saat belajar, debugging, atau mengecek hasil proses sementara.",
      "Template literal memakai backtick dan ${} untuk menyisipkan nilai variabel ke dalam teks secara rapi.",
      "Nama variabel sebaiknya memakai camelCase seperti namaSiswa atau totalNilai agar sesuai kebiasaan JavaScript modern.",
      "Semicolon tidak selalu wajib, tetapi konsistensi gaya penulisan membuat kode lebih mudah dibaca tim.",
      "Error dasar sering terjadi karena tanda kutip tidak lengkap, kurung belum ditutup, atau variabel dipakai sebelum dibuat.",
    ],
    skills: ["let", "const", "console.log()"],
    code: `const nama = "Afghany";
const kelas = "XII RPL";
let target = "Frontend Developer";

console.log(nama + " dari " + kelas + " belajar JavaScript untuk menjadi " + target + ".");`,
    mission:
      "Buat program perkenalan digital siswa XII RPL memakai variabel JavaScript.",
    games: [
      {
        id: "js1-choice",
        kind: "choice",
        title: "Variable Builder",
        prompt: "Keyword mana yang tepat untuk nilai JavaScript yang tidak akan diganti?",
        options: ["const", "def", "varian", "echo"],
        answer: "const",
        hint: "Keyword ini dipakai untuk binding yang tidak di-assign ulang.",
      },
      {
        id: "js1-sequence",
        kind: "sequence",
        title: "Console Sequencer",
        prompt: "Susun instruksi agar console menampilkan profil siswa dengan benar.",
        options: [
          `console.log(nama + " - " + kelas);`,
          `const kelas = "XII RPL";`,
          `const nama = "Afghany";`,
        ],
        answer: [
          `const nama = "Afghany";`,
          `const kelas = "XII RPL";`,
          `console.log(nama + " - " + kelas);`,
        ],
        hint: "Variabel harus dibuat sebelum dipakai di console.log().",
      },
      {
        id: "js1-locate",
        kind: "locate",
        title: "Quote Scanner",
        prompt: "Klik baris yang salah karena string belum ditutup.",
        codeLines: [
          { id: "1", label: "01", text: `const nama = "Dina";` },
          { id: "2", label: "02", text: `const kelas = "XII RPL;` },
          { id: "3", label: "03", text: `console.log(nama);` },
          { id: "4", label: "04", text: `console.log(kelas);` },
        ],
        answer: "2",
        hint: "String harus punya tanda kutip pembuka dan penutup.",
      },
      {
        id: "js1-output",
        kind: "output",
        title: "Console Vision",
        prompt: "Output apa yang muncul dari kode berikut?",
        code: `const nama = "Raka";
const kelas = "XII RPL";
console.log(nama + " - " + kelas);`,
        options: ["Raka - XII RPL", "nama - kelas", "{nama} - {kelas}", "Error"],
        answer: "Raka - XII RPL",
        hint: "Operator + menggabungkan string dengan nilai variabel.",
      },
      {
        id: "js1-live",
        kind: "live-code",
        title: "Live Coding: Profil JavaScript",
        prompt:
          "Tulis kode JavaScript yang membuat variabel nama dan kelas, lalu tampilkan dengan console.log().",
        starter: `// Buat profil siswa
const nama = "";
const kelas = "";

`,
        requirements: [
          "Ada const nama berisi teks.",
          "Ada const kelas berisi XII RPL.",
          "Ada console.log() yang menampilkan data.",
        ],
        checks: [
          { label: "const nama", pattern: "const\\s+nama\\s*=\\s*[\"'][^\"']+[\"']" },
          { label: "kelas XII RPL", pattern: "const\\s+kelas\\s*=\\s*[\"']XII RPL[\"']" },
          { label: "console log", pattern: "console\\.log\\s*\\(" },
        ],
        successMessage: "Profil JavaScript sudah valid.",
        hint: "Contoh: const nama = \"Afghany\"; lalu console.log(nama);",
      },
    ],
  },
  {
    id: 202,
    slug: "javascript-data",
    title: "Modul 2",
    subtitle: "Data dan Struktur JavaScript",
    focus: "Array, object, indexing, dan property",
    minutes: 50,
    level: "Dasar",
    color: "#74d4ff",
    icon: "data",
    theory: [
      "Array menyimpan banyak nilai berurutan dan diakses memakai index angka mulai dari 0.",
      "Object menyimpan data dalam pasangan property dan value, cocok untuk profil siswa atau konfigurasi aplikasi.",
      "Property object dapat dibaca dengan dot notation seperti siswa.nama atau bracket notation seperti siswa[\"nama\"].",
      "Array punya method seperti push(), map(), filter(), dan reduce() untuk mengolah kumpulan data.",
      "Object dan array bisa digabung menjadi data nested, misalnya object siswa yang punya property nilai berisi array.",
      "Gunakan nama property yang konsisten agar data mudah dipakai di UI, API, dan database.",
      "Index yang tidak tersedia menghasilkan undefined, bukan error langsung, sehingga perlu dicek sebelum dipakai.",
      "Struktur data yang jelas membuat logika halaman lebih mudah dirawat karena bentuk data dapat ditebak.",
    ],
    skills: ["array", "object", "property"],
    code: `const siswa = {
  nama: "Raka",
  kelas: "XII RPL",
  nilai: [88, 92, 95],
};

const total = siswa.nilai[0] + siswa.nilai[1] + siswa.nilai[2];
console.log(siswa.nama + " punya total nilai " + total);`,
    mission:
      "Modelkan data siswa, kelas, dan nilai proyek memakai array dan object JavaScript.",
    games: [
      {
        id: "js2-choice",
        kind: "choice",
        title: "Structure Matcher",
        prompt: "Struktur paling tepat untuk menyimpan daftar nilai berurutan adalah...",
        options: ["array", "boolean", "function", "string"],
        answer: "array",
        hint: "Struktur ini memakai index angka mulai dari 0.",
      },
      {
        id: "js2-sequence",
        kind: "sequence",
        title: "Object Builder",
        prompt: "Susun kode agar nama siswa dapat ditampilkan dari object.",
        options: [
          `console.log(siswa.nama);`,
          `const siswa = {`,
          `  nama: "Raka"`,
          `};`,
        ],
        answer: [
          `const siswa = {`,
          `  nama: "Raka"`,
          `};`,
          `console.log(siswa.nama);`,
        ],
        hint: "Object dibuka, property ditulis, object ditutup, lalu property dibaca.",
      },
      {
        id: "js2-locate",
        kind: "locate",
        title: "Property Hunt",
        prompt: "Klik baris yang menghasilkan undefined karena property tidak tersedia.",
        codeLines: [
          { id: "1", label: "01", text: `const siswa = { nama: "Raka", kelas: "XII RPL" };` },
          { id: "2", label: "02", text: `console.log(siswa.nama);` },
          { id: "3", label: "03", text: `console.log(siswa.jurusan);` },
          { id: "4", label: "04", text: `console.log(siswa.kelas);` },
        ],
        answer: "3",
        hint: "Object hanya punya property nama dan kelas.",
      },
      {
        id: "js2-output",
        kind: "output",
        title: "Index Decoder",
        prompt: "Output apa yang muncul dari kode berikut?",
        code: `const stack = ["HTML", "CSS", "JavaScript"];
console.log(stack[2]);`,
        options: ["HTML", "CSS", "JavaScript", "undefined"],
        answer: "JavaScript",
        hint: "Index array dimulai dari 0.",
      },
      {
        id: "js2-live",
        kind: "live-code",
        title: "Live Coding: Data Siswa",
        prompt:
          "Tulis object siswa dengan nama, kelas, dan array nilai. Lalu tampilkan nama siswa.",
        starter: `const siswa = {

};

`,
        requirements: [
          "Ada object bernama siswa.",
          "Ada property nilai berisi array.",
          "Ada console.log() yang membaca property siswa.",
        ],
        checks: [
          { label: "object siswa", pattern: "const\\s+siswa\\s*=\\s*\\{" },
          { label: "array nilai", pattern: "nilai\\s*:\\s*\\[[^\\]]+\\]" },
          { label: "console property", pattern: "console\\.log\\s*\\([^\\)]*siswa\\." },
        ],
        successMessage: "Data siswa JavaScript sudah valid.",
        hint: "Gunakan const siswa = { nama: \"Raka\", nilai: [88, 92] };",
      },
    ],
  },
  {
    id: 203,
    slug: "javascript-control-flow",
    title: "Modul 3",
    subtitle: "Control Flow JavaScript",
    focus: "if, else, switch, for, dan operator logika",
    minutes: 55,
    level: "Menengah",
    color: "#ffd166",
    icon: "flow",
    theory: [
      "Control flow membuat program memilih jalur berdasarkan kondisi atau mengulang proses pada banyak data.",
      "if, else if, dan else dipakai ketika keputusan bergantung pada ekspresi boolean.",
      "Operator === membandingkan nilai dan tipe data, sehingga lebih aman daripada == untuk sebagian besar kasus.",
      "Operator && membuat dua syarat harus benar, sedangkan || cukup salah satu syarat benar.",
      "for cocok untuk pengulangan dengan jumlah iterasi yang jelas, misalnya menelusuri array nilai.",
      "switch cocok untuk banyak pilihan yang berasal dari satu nilai seperti status, role, atau kategori.",
      "Kurung kurawal menentukan batas blok kode. Baris di dalam blok hanya berjalan jika kondisi terpenuhi.",
      "Urutkan kondisi dari yang paling spesifik ke yang umum agar hasil tidak tertutup oleh cabang sebelumnya.",
    ],
    skills: ["if", "for", "operator logika"],
    code: `const nilai = 86;
const absen = 96;

if (nilai >= 80 && absen >= 90) {
  console.log("Lulus dengan rekomendasi industri");
} else if (nilai >= 75) {
  console.log("Lulus");
} else {
  console.log("Perlu penguatan");
}`,
    mission:
      "Bangun logika kelulusan siswa memakai percabangan dan operator logika JavaScript.",
    games: [
      {
        id: "js3-choice",
        kind: "choice",
        title: "Logic Gate",
        prompt: "Operator JavaScript mana yang membuat dua kondisi harus sama-sama benar?",
        options: ["&&", "||", "!", "??"],
        answer: "&&",
        hint: "Operator ini berarti AND.",
      },
      {
        id: "js3-sequence",
        kind: "sequence",
        title: "Branch Builder",
        prompt: "Susun jalur keputusan JavaScript agar status nilai bisa ditentukan.",
        options: [
          `} else { status = "Perlu latihan"; }`,
          `if (nilai >= 80) { status = "Kompeten";`,
          `} else if (nilai >= 75) { status = "Lulus";`,
        ],
        answer: [
          `if (nilai >= 80) { status = "Kompeten";`,
          `} else if (nilai >= 75) { status = "Lulus";`,
          `} else { status = "Perlu latihan"; }`,
        ],
        hint: "Percabangan dimulai dari if, lalu else if, lalu else.",
      },
      {
        id: "js3-locate",
        kind: "locate",
        title: "Comparison Radar",
        prompt: "Klik baris yang memakai assignment, bukan perbandingan.",
        codeLines: [
          { id: "1", label: "01", text: `const nilai = 90;` },
          { id: "2", label: "02", text: `if (nilai = 90) {` },
          { id: "3", label: "03", text: `  console.log("A");` },
          { id: "4", label: "04", text: `}` },
        ],
        answer: "2",
        hint: "Perbandingan ketat memakai ===, bukan =.",
      },
      {
        id: "js3-output",
        kind: "output",
        title: "Branch Predictor",
        prompt: "Output apa yang dicetak program?",
        code: `const nilai = 78;
if (nilai >= 80) {
  console.log("Kompeten");
} else if (nilai >= 75) {
  console.log("Lulus");
} else {
  console.log("Latihan");
}`,
        options: ["Kompeten", "Lulus", "Latihan", "Tidak ada output"],
        answer: "Lulus",
        hint: "78 belum mencapai 80, tetapi mencapai 75.",
      },
      {
        id: "js3-live",
        kind: "live-code",
        title: "Live Coding: Status Kelulusan",
        prompt:
          "Tulis logika kelulusan dengan if, else if, else, dan operator &&.",
        starter: `const nilai = 86;
const absen = 96;

`,
        requirements: [
          "Ada if dengan operator &&.",
          "Ada else if untuk jalur alternatif.",
          "Ada else untuk kondisi terakhir.",
        ],
        checks: [
          { label: "if", pattern: "\\bif\\s*\\(" },
          { label: "operator &&", pattern: "&&" },
          { label: "else if dan else", pattern: "else\\s+if[\\s\\S]*else" },
        ],
        successMessage: "Control flow JavaScript sudah lengkap.",
        hint: "Gunakan if (nilai >= 80 && absen >= 90) { ... } else if (...) { ... } else { ... }.",
      },
    ],
  },
  {
    id: 204,
    slug: "javascript-functions",
    title: "Modul 4",
    subtitle: "Function JavaScript",
    focus: "Function declaration, parameter, return, dan arrow function",
    minutes: 60,
    level: "Menengah",
    color: "#ff7a90",
    icon: "function",
    theory: [
      "Function membungkus langkah kerja agar dapat dipakai ulang tanpa menyalin kode.",
      "Parameter adalah input function, sedangkan return mengirim hasil kembali ke pemanggil.",
      "Function declaration memakai keyword function dan dapat dipanggil sebelum definisinya karena hoisting.",
      "Arrow function sering dipakai untuk callback, method array, dan kode modern yang ringkas.",
      "return berbeda dari console.log(). return menghasilkan nilai, sedangkan console.log() hanya menampilkan data.",
      "Function yang jelas biasanya punya satu tanggung jawab, misalnya hitungRataRata atau formatPredikat.",
      "Default parameter dapat dipakai ketika argumen tidak dikirim oleh pemanggil.",
      "Nama function sebaiknya memakai kata kerja agar tugasnya mudah dipahami.",
    ],
    skills: ["function", "return", "arrow function"],
    code: `function hitungPredikat(nilai) {
  if (nilai >= 90) {
    return "Sangat Baik";
  }
  if (nilai >= 80) {
    return "Baik";
  }
  return "Perlu Latihan";
}

console.log(hitungPredikat(92));`,
    mission:
      "Buat function penilai proyek JavaScript agar banyak nilai siswa dapat diproses ulang.",
    games: [
      {
        id: "js4-choice",
        kind: "choice",
        title: "Return Signal",
        prompt: "Keyword apa yang mengirim hasil dari function ke pemanggil?",
        options: ["return", "console", "break", "import"],
        answer: "return",
        hint: "Keyword ini membuat function menghasilkan nilai.",
      },
      {
        id: "js4-sequence",
        kind: "sequence",
        title: "Function Forge",
        prompt: "Rakit function yang mengembalikan total setelah diskon.",
        options: [
          `return harga - potongan;`,
          `const potongan = harga * diskon;`,
          `function hitungTotal(harga, diskon) {`,
        ],
        answer: [
          `function hitungTotal(harga, diskon) {`,
          `const potongan = harga * diskon;`,
          `return harga - potongan;`,
        ],
        hint: "Header function berada di atas, lalu proses, lalu return.",
      },
      {
        id: "js4-locate",
        kind: "locate",
        title: "Argument Tracker",
        prompt: "Klik baris yang memanggil function dengan argumen kurang lengkap.",
        codeLines: [
          { id: "1", label: "01", text: `function total(a, b) {` },
          { id: "2", label: "02", text: `  return a + b;` },
          { id: "3", label: "03", text: `}` },
          { id: "4", label: "04", text: `console.log(total(5));` },
        ],
        answer: "4",
        hint: "Function total membutuhkan dua argumen.",
      },
      {
        id: "js4-output",
        kind: "output",
        title: "Function Output",
        prompt: "Apa output dari pemanggilan function ini?",
        code: `function kali(a, b) {
  return a * b;
}

console.log(kali(3, 4));`,
        options: ["7", "12", "kali(3, 4)", "undefined"],
        answer: "12",
        hint: "Operator * mengalikan dua angka.",
      },
      {
        id: "js4-live",
        kind: "live-code",
        title: "Live Coding: Function Predikat",
        prompt:
          "Buat function hitungPredikat(nilai) yang memakai parameter, if, dan return.",
        starter: `function hitungPredikat(nilai) {
  // tulis logika di sini
}

`,
        requirements: [
          "Ada function hitungPredikat dengan parameter nilai.",
          "Ada percabangan if.",
          "Ada minimal satu return.",
        ],
        checks: [
          { label: "function parameter", pattern: "function\\s+hitungPredikat\\s*\\(\\s*nilai\\s*\\)" },
          { label: "if", pattern: "\\bif\\s*\\(" },
          { label: "return", pattern: "\\breturn\\b" },
        ],
        successMessage: "Function predikat JavaScript sudah bisa dipakai ulang.",
        hint: "Gunakan function hitungPredikat(nilai) { if (...) return \"Baik\"; return \"Latihan\"; }",
      },
    ],
  },
  {
    id: 205,
    slug: "javascript-dom-events",
    title: "Modul 5",
    subtitle: "DOM dan Event",
    focus: "querySelector, textContent, addEventListener, dan interaksi halaman",
    minutes: 65,
    level: "Menengah",
    color: "#b892ff",
    icon: "oop",
    theory: [
      "DOM adalah representasi elemen HTML yang dapat dibaca dan diubah oleh JavaScript.",
      "document.querySelector() memilih elemen pertama yang cocok dengan selector CSS.",
      "textContent dipakai untuk mengubah teks elemen tanpa memproses HTML di dalamnya.",
      "addEventListener() memasang handler ketika user melakukan aksi seperti click, input, atau submit.",
      "Event object menyimpan informasi aksi user, misalnya target input atau tombol yang diklik.",
      "Manipulasi DOM sebaiknya jelas dan terbatas agar UI tidak sulit dilacak ketika aplikasi membesar.",
      "Validasi input di sisi client membantu user cepat memperbaiki data sebelum dikirim ke server.",
      "Gunakan class CSS untuk mengatur tampilan, lalu JavaScript cukup menambah atau menghapus class sesuai kondisi.",
    ],
    skills: ["querySelector", "addEventListener", "textContent"],
    code: `const tombol = document.querySelector("#simpan");
const statusEl = document.querySelector("#status");

tombol.addEventListener("click", function () {
  statusEl.textContent = "Profil berhasil disimpan";
});`,
    mission:
      "Buat interaksi tombol yang mengubah status halaman profil siswa.",
    games: [
      {
        id: "js5-choice",
        kind: "choice",
        title: "DOM Selector",
        prompt: "Method mana yang memilih elemen pertama berdasarkan selector CSS?",
        options: ["querySelector()", "print()", "fetchAll()", "useState()"],
        answer: "querySelector()",
        hint: "Method ini berada di object document.",
      },
      {
        id: "js5-sequence",
        kind: "sequence",
        title: "Click Flow",
        prompt: "Susun urutan membuat tombol mengubah teks status.",
        options: [
          `statusEl.textContent = "Tersimpan";`,
          `tombol.addEventListener("click", function () {`,
          `const tombol = document.querySelector("#simpan");`,
        ],
        answer: [
          `const tombol = document.querySelector("#simpan");`,
          `tombol.addEventListener("click", function () {`,
          `statusEl.textContent = "Tersimpan";`,
        ],
        hint: "Elemen dipilih dulu, lalu event dipasang, lalu aksi dijalankan.",
      },
      {
        id: "js5-locate",
        kind: "locate",
        title: "Selector Bug",
        prompt: "Klik baris yang berisiko error karena selector tidak sesuai id tombol.",
        codeLines: [
          { id: "1", label: "01", text: `<button id="simpan">Simpan</button>` },
          { id: "2", label: "02", text: `const tombol = document.querySelector("#submit");` },
          { id: "3", label: "03", text: `tombol.addEventListener("click", simpanData);` },
          { id: "4", label: "04", text: `function simpanData() { console.log("ok"); }` },
        ],
        answer: "2",
        hint: "HTML memakai id simpan, tetapi selector memilih id submit.",
      },
      {
        id: "js5-output",
        kind: "output",
        title: "Text Update",
        prompt: "Setelah tombol diklik, teks apa yang ada di status?",
        code: `statusEl.textContent = "Siap";
statusEl.textContent = "Tersimpan";`,
        options: ["Siap", "Tersimpan", "statusEl", "undefined"],
        answer: "Tersimpan",
        hint: "Assignment kedua mengganti teks sebelumnya.",
      },
      {
        id: "js5-live",
        kind: "live-code",
        title: "Live Coding: Tombol Status",
        prompt:
          "Tulis kode yang memilih #simpan dan #status, lalu memasang event click untuk mengubah textContent.",
        starter: `const tombol = document.querySelector("#simpan");
const statusEl = document.querySelector("#status");

`,
        requirements: [
          "Ada querySelector untuk tombol.",
          "Ada addEventListener dengan event click.",
          "Ada perubahan textContent.",
        ],
        checks: [
          { label: "querySelector", pattern: "document\\.querySelector\\s*\\(" },
          { label: "event click", pattern: "addEventListener\\s*\\(\\s*[\"']click[\"']" },
          { label: "textContent", pattern: "\\.textContent\\s*=" },
        ],
        successMessage: "Interaksi DOM sudah valid.",
        hint: "Gunakan tombol.addEventListener(\"click\", function () { statusEl.textContent = \"...\"; });",
      },
    ],
  },
  {
    id: 206,
    slug: "javascript-array-methods",
    title: "Modul 6",
    subtitle: "Array Methods",
    focus: "map, filter, reduce, find, dan transformasi data",
    minutes: 70,
    level: "Lanjut",
    color: "#4dd4ac",
    icon: "file",
    theory: [
      "Method array membantu mengolah data tanpa menulis perulangan manual yang panjang.",
      "map() mengubah setiap item menjadi bentuk baru dan menghasilkan array baru.",
      "filter() memilih item yang memenuhi kondisi tertentu dan menghasilkan array baru.",
      "reduce() menggabungkan banyak nilai menjadi satu hasil seperti total, rata-rata, atau ringkasan.",
      "find() mengambil item pertama yang cocok dengan kondisi, cocok untuk mencari data detail.",
      "Callback adalah function yang dikirim sebagai argumen ke method seperti map dan filter.",
      "Array method tidak selalu mengubah array asli. Banyak method menghasilkan array baru sehingga lebih mudah dilacak.",
      "Transformasi data sering dipakai sebelum data ditampilkan ke UI atau dikirim ke API.",
    ],
    skills: ["map()", "filter()", "reduce()"],
    code: `const nilai = [80, 92, 75, 88];

const kompeten = nilai.filter(function (item) {
  return item >= 80;
});

const total = kompeten.reduce(function (jumlah, item) {
  return jumlah + item;
}, 0);

console.log(total);`,
    mission:
      "Olah daftar nilai proyek siswa memakai map, filter, dan reduce.",
    games: [
      {
        id: "js6-choice",
        kind: "choice",
        title: "Method Matcher",
        prompt: "Method array mana yang memilih item sesuai kondisi?",
        options: ["filter()", "map()", "push()", "join()"],
        answer: "filter()",
        hint: "Method ini menyaring data.",
      },
      {
        id: "js6-sequence",
        kind: "sequence",
        title: "Reduce Pipeline",
        prompt: "Susun kode agar total nilai dapat dihitung.",
        options: [
          `console.log(total);`,
          `const total = nilai.reduce((jumlah, item) => jumlah + item, 0);`,
          `const nilai = [80, 90, 100];`,
        ],
        answer: [
          `const nilai = [80, 90, 100];`,
          `const total = nilai.reduce((jumlah, item) => jumlah + item, 0);`,
          `console.log(total);`,
        ],
        hint: "Array dibuat dulu, lalu dihitung, lalu ditampilkan.",
      },
      {
        id: "js6-locate",
        kind: "locate",
        title: "Callback Bug",
        prompt: "Klik baris yang membuat filter tidak mengembalikan kondisi.",
        codeLines: [
          { id: "1", label: "01", text: `const nilai = [70, 85, 90];` },
          { id: "2", label: "02", text: `const kompeten = nilai.filter((item) => {` },
          { id: "3", label: "03", text: `  item >= 80;` },
          { id: "4", label: "04", text: `});` },
        ],
        answer: "3",
        hint: "Callback dengan kurung kurawal perlu return eksplisit.",
      },
      {
        id: "js6-output",
        kind: "output",
        title: "Map Output",
        prompt: "Apa hasil array yang dibuat kode berikut?",
        code: `const nilai = [1, 2, 3];
const hasil = nilai.map((item) => item * 2);
console.log(hasil);`,
        options: ["[2, 4, 6]", "[1, 2, 3]", "6", "undefined"],
        answer: "[2, 4, 6]",
        hint: "map() mengubah setiap item menjadi item * 2.",
      },
      {
        id: "js6-live",
        kind: "live-code",
        title: "Live Coding: Nilai Kompeten",
        prompt:
          "Tulis kode yang membuat array nilai, menyaring nilai >= 80 dengan filter, lalu menghitung total dengan reduce.",
        starter: `const nilai = [80, 92, 75, 88];

`,
        requirements: [
          "Ada array nilai.",
          "Ada filter untuk nilai >= 80.",
          "Ada reduce untuk menghitung total.",
        ],
        checks: [
          { label: "array nilai", pattern: "const\\s+nilai\\s*=\\s*\\[[^\\]]+\\]" },
          { label: "filter", pattern: "\\.filter\\s*\\(" },
          { label: "reduce", pattern: "\\.reduce\\s*\\(" },
        ],
        successMessage: "Pengolahan array JavaScript sudah valid.",
        hint: "Gunakan nilai.filter((item) => item >= 80).reduce((total, item) => total + item, 0).",
      },
    ],
  },
  {
    id: 207,
    slug: "javascript-async-api",
    title: "Modul 7",
    subtitle: "Async dan API",
    focus: "Promise, async/await, fetch, JSON, dan error handling",
    minutes: 75,
    level: "Lanjut",
    color: "#5ec7ff",
    icon: "api",
    theory: [
      "Kode asynchronous dipakai ketika proses membutuhkan waktu, misalnya mengambil data dari API.",
      "Promise mewakili hasil operasi yang akan selesai nanti, baik berhasil maupun gagal.",
      "async function membuat function selalu mengembalikan Promise dan dapat memakai await di dalamnya.",
      "await menunggu Promise selesai sebelum lanjut ke baris berikutnya di dalam async function.",
      "fetch() mengirim request HTTP dan mengembalikan response yang perlu dibaca, misalnya dengan response.json().",
      "try...catch dipakai untuk menangani error agar aplikasi tidak berhenti tanpa pesan yang jelas.",
      "Response API perlu dicek statusnya karena request bisa selesai tetapi server mengembalikan error.",
      "Loading state penting agar user tahu aplikasi sedang menunggu data dari server.",
    ],
    skills: ["async", "await", "fetch()"],
    code: `async function ambilProfil() {
  try {
    const response = await fetch("/api/profile");
    const data = await response.json();
    console.log(data.nama);
  } catch (error) {
    console.log("Gagal mengambil profil");
  }
}

ambilProfil();`,
    mission:
      "Ambil data profil siswa dari API memakai fetch, async/await, dan error handling.",
    games: [
      {
        id: "js7-choice",
        kind: "choice",
        title: "Async Keyword",
        prompt: "Keyword apa yang menunggu Promise selesai di dalam async function?",
        options: ["await", "sleep", "pause", "hold"],
        answer: "await",
        hint: "Keyword ini hanya dipakai langsung di dalam async function atau module modern.",
      },
      {
        id: "js7-sequence",
        kind: "sequence",
        title: "Fetch Pipeline",
        prompt: "Susun langkah mengambil JSON dari API.",
        options: [
          `const data = await response.json();`,
          `async function loadData() {`,
          `const response = await fetch("/api/profile");`,
        ],
        answer: [
          `async function loadData() {`,
          `const response = await fetch("/api/profile");`,
          `const data = await response.json();`,
        ],
        hint: "Function dibuat async dulu, lalu fetch, lalu response dibaca sebagai JSON.",
      },
      {
        id: "js7-locate",
        kind: "locate",
        title: "Await Bug",
        prompt: "Klik baris yang salah karena await dipakai di function biasa.",
        codeLines: [
          { id: "1", label: "01", text: `function loadData() {` },
          { id: "2", label: "02", text: `  const response = await fetch("/api/profile");` },
          { id: "3", label: "03", text: `  return response.json();` },
          { id: "4", label: "04", text: `}` },
        ],
        answer: "2",
        hint: "Function perlu diberi async jika memakai await di dalamnya.",
      },
      {
        id: "js7-output",
        kind: "output",
        title: "JSON Reader",
        prompt: "Property apa yang ditampilkan kode berikut?",
        code: `const data = { nama: "Dina", kelas: "XII RPL" };
console.log(data.nama);`,
        options: ["Dina", "XII RPL", "nama", "undefined"],
        answer: "Dina",
        hint: "data.nama membaca property nama.",
      },
      {
        id: "js7-live",
        kind: "live-code",
        title: "Live Coding: Fetch Profil",
        prompt:
          "Buat async function ambilProfil yang memakai await fetch, response.json(), dan try...catch.",
        starter: `async function ambilProfil() {

}

`,
        requirements: [
          "Ada async function ambilProfil.",
          "Ada await fetch().",
          "Ada try dan catch.",
        ],
        checks: [
          { label: "async function", pattern: "async\\s+function\\s+ambilProfil\\s*\\(" },
          { label: "await fetch", pattern: "await\\s+fetch\\s*\\(" },
          { label: "try catch", pattern: "\\btry\\b[\\s\\S]*\\bcatch\\b" },
        ],
        successMessage: "Fetch API JavaScript sudah valid.",
        hint: "Gunakan try { const response = await fetch(\"/api/profile\"); } catch (error) { ... }",
      },
    ],
  },
  {
    id: 208,
    slug: "javascript-module-project",
    title: "Modul 8",
    subtitle: "Module Mini Project",
    focus: "import, export, modularisasi, localStorage, dan integrasi UI",
    minutes: 80,
    level: "Lanjut",
    color: "#37e5a5",
    icon: "debug",
    theory: [
      "Module membantu memecah kode JavaScript menjadi beberapa file yang fokus pada tugas tertentu.",
      "export membuat function, object, atau nilai dapat dipakai file lain.",
      "import mengambil export dari file lain agar kode tidak perlu disalin.",
      "Modularisasi membuat project lebih mudah diuji, dibaca, dan dikerjakan bersama tim.",
      "localStorage dapat menyimpan data sederhana di browser, misalnya preferensi atau draft form.",
      "JSON.stringify() mengubah object menjadi string sebelum disimpan ke localStorage.",
      "JSON.parse() mengubah string JSON dari localStorage kembali menjadi object JavaScript.",
      "Project kecil tetap butuh struktur folder dan penamaan file yang rapi agar mudah dikembangkan menjadi aplikasi nyata.",
    ],
    skills: ["import", "export", "localStorage"],
    code: `export function simpanProfil(profil) {
  const json = JSON.stringify(profil);
  localStorage.setItem("profil-siswa", json);
}

export function ambilProfil() {
  const json = localStorage.getItem("profil-siswa");
  return json ? JSON.parse(json) : null;
}`,
    mission:
      "Bangun mini project penyimpan profil siswa dengan module dan localStorage.",
    games: [
      {
        id: "js8-choice",
        kind: "choice",
        title: "Module Export",
        prompt: "Keyword apa yang membuat function bisa dipakai file JavaScript lain?",
        options: ["export", "echo", "public", "send"],
        answer: "export",
        hint: "Keyword ini dipasangkan dengan import di file lain.",
      },
      {
        id: "js8-sequence",
        kind: "sequence",
        title: "Storage Pipeline",
        prompt: "Susun urutan menyimpan object profil ke localStorage.",
        options: [
          `localStorage.setItem("profil", json);`,
          `const json = JSON.stringify(profil);`,
          `const profil = { nama: "Raka" };`,
        ],
        answer: [
          `const profil = { nama: "Raka" };`,
          `const json = JSON.stringify(profil);`,
          `localStorage.setItem("profil", json);`,
        ],
        hint: "Object dibuat, diubah menjadi string JSON, lalu disimpan.",
      },
      {
        id: "js8-locate",
        kind: "locate",
        title: "Storage Bug",
        prompt: "Klik baris yang salah karena object disimpan langsung tanpa JSON.stringify().",
        codeLines: [
          { id: "1", label: "01", text: `const profil = { nama: "Raka" };` },
          { id: "2", label: "02", text: `localStorage.setItem("profil", profil);` },
          { id: "3", label: "03", text: `const json = localStorage.getItem("profil");` },
          { id: "4", label: "04", text: `console.log(json);` },
        ],
        answer: "2",
        hint: "localStorage menyimpan string, jadi object perlu JSON.stringify().",
      },
      {
        id: "js8-output",
        kind: "output",
        title: "JSON Parse",
        prompt: "Apa nilai data.nama setelah JSON.parse()?",
        code: `const json = '{"nama":"Dina"}';
const data = JSON.parse(json);
console.log(data.nama);`,
        options: ["Dina", "nama", "{\"nama\":\"Dina\"}", "undefined"],
        answer: "Dina",
        hint: "JSON.parse() mengubah string menjadi object.",
      },
      {
        id: "js8-live",
        kind: "live-code",
        title: "Live Coding: Profil Storage",
        prompt:
          "Tulis function simpanProfil yang memakai export, JSON.stringify, dan localStorage.setItem.",
        starter: `export function simpanProfil(profil) {

}
`,
        requirements: [
          "Ada export function simpanProfil.",
          "Ada JSON.stringify().",
          "Ada localStorage.setItem().",
        ],
        checks: [
          { label: "export function", pattern: "export\\s+function\\s+simpanProfil\\s*\\(" },
          { label: "JSON stringify", pattern: "JSON\\.stringify\\s*\\(" },
          { label: "localStorage setItem", pattern: "localStorage\\.setItem\\s*\\(" },
        ],
        successMessage: "Mini project module JavaScript sudah valid.",
        hint: "Gunakan const json = JSON.stringify(profil); lalu localStorage.setItem(\"profil\", json);",
      },
    ],
  },
];

export const lmsCourses: LmsCourse[] = [
  {
    id: "python",
    slug: "pemrograman-web",
    title: "Python",
    shortTitle: "Python",
    label: "Python",
    description:
      "Kelas Python untuk membangun fondasi pemrograman web, mulai dari sintaks dasar sampai API mini project.",
    stack: "Python",
    level: "XII RPL",
    modules,
  },
  {
    id: "javascript",
    slug: "javascript",
    title: "JavaScript",
    shortTitle: "JavaScript",
    label: "JavaScript",
    description:
      "Kelas JavaScript untuk membangun fondasi interaksi web, mulai dari sintaks dasar, DOM, async API, sampai mini project module.",
    stack: "JavaScript",
    level: "XII RPL",
    modules: javascriptModules,
  },
  {
    id: "flutter",
    slug: "flutter",
    title: "Flutter",
    shortTitle: "Flutter",
    label: "Flutter",
    description:
      "Kelas Flutter dari project setup, UI, navigation, state, Firebase, API, custom code, sampai deployment.",
    stack: "Flutter",
    level: "XII RPL",
    modules: flutterModules,
  },
];

export const allModules = lmsCourses.flatMap((course) => course.modules);

export function getCourseBySlug(slug: string) {
  return lmsCourses.find((course) => course.slug === slug) ?? lmsCourses[0];
}

export const gamesPerModule = 5;

export const totalLearningMinutes = allModules.reduce(
  (total, item) => total + item.minutes,
  0,
);
