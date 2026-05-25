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
    ],
    skills: ["print()", "variabel", "f-string"],
    code: `nama = "Alya"
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
          `nama = "Alya"`,
        ],
        answer: [
          `nama = "Alya"`,
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
        code: `nama = "Alya"
kelas = "XII RPL"
print(f"{nama} - {kelas}")`,
        options: ["Alya - XII RPL", "{nama} - {kelas}", "nama - kelas", "Error"],
        answer: "Alya - XII RPL",
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
        hint: "Contoh pola: nama = \"Alya\", kelas = \"XII RPL\", lalu print(f\"...\").",
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
    ],
    skills: ["class", "__init__", "method"],
    code: `class Proyek:
    def __init__(self, nama, stack):
        self.nama = nama
        self.stack = stack

    def ringkasan(self):
        return f"{self.nama} memakai {self.stack}"

api = Proyek("LMS Python", "Next.js dan NeonDB")
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
    ],
    skills: ["JSON", "endpoint", "database"],
    code: `payload = {
    "student_id": "xii-rpl-01",
    "module_id": 8,
    "score": 100,
}

print(payload["student_id"])`,
    mission:
      "Rancang endpoint progress belajar yang bisa disimpan ke NeonDB.",
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

export const gamesPerModule = 5;

export const totalLearningMinutes = modules.reduce(
  (total, item) => total + item.minutes,
  0,
);
