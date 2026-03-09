const PASSWORD_GURU="admin123"

/* ================= TIMER ================= */

let waktuTes = localStorage.getItem("timerTes") || 20

let soal=[
{t:"2 + 2 = ?",a:["3","4","5"],k:1,bobot:1},
{t:"5 x 2 = ?",a:["10","8","12"],k:0,bobot:1},
{t:"10 - 5 = ?",a:["5","4","6"],k:0,bobot:1},
{t:"Ibukota Indonesia?",a:["Bandung","Jakarta","Surabaya"],k:1,bobot:1}
]

let index=0
let jawaban=JSON.parse(localStorage.getItem("jawabanSiswa"))||[]
let waktu = waktuTes * 60
let timerInterval


function keLogin(){
homePage.style.display="none"
loginPage.style.display="block"
}

function loginGuruPage(){
homePage.style.display="none"
loginGuru.style.display="block"
}

function kembaliHome(){
location.reload()
}

/* ================= MULAI TES ================= */

function mulaiTes(){

if(nama.value==""){
alert("Isi nama dulu")
return
}

waktu = (localStorage.getItem("timerTes") || 20) * 60

loginPage.style.display="none"
tesPage.style.display="block"

buatNomorSoal()
tampilkanSoal()
mulaiTimer()

}

/* ================= NOMOR SOAL ================= */

function buatNomorSoal(){

let html=""

soal.forEach((s,i)=>{

html+=`<div class="nomorBtn" onclick="lompatSoal(${i})" id="n${i}">${i+1}</div>`

})

nomorSoal.innerHTML=html

updateNomor()

}

/* ================= TAMPIL SOAL ================= */

function tampilkanSoal(){

let s=soal[index]

let html=`<h3>Soal ${index+1}</h3>`
html+=`<p>${s.t}</p>`

s.a.forEach((p,i)=>{

html+=`
<label>
<input type="radio" name="j" onclick="simpan(${i})"
${jawaban[index]==i?'checked':''}>
${p}
</label><br>
`

})

soalBox.innerHTML=html

updateNomor()

}

/* ================= SIMPAN JAWABAN ================= */

function simpan(i){

jawaban[index]=i

localStorage.setItem("jawabanSiswa",JSON.stringify(jawaban))

updateNomor()

}

/* ================= UPDATE NOMOR SOAL ================= */

function updateNomor(){

soal.forEach((s,i)=>{

let btn=document.getElementById("n"+i)

btn.classList.remove("aktif","jawab","kosong")

if(jawaban[i]!=null){
btn.classList.add("jawab")
}else{
btn.classList.add("kosong")
}

})

document.getElementById("n"+index).classList.add("aktif")

}

function lompatSoal(i){
index=i
tampilkanSoal()
}

function soalBerikutnya(){
if(index<soal.length-1){
index++
tampilkanSoal()
}
}

function soalSebelumnya(){
if(index>0){
index--
tampilkanSoal()
}
}

/* ================= TIMER ================= */

function mulaiTimer(){

timerInterval=setInterval(function(){

waktu--

let m=Math.floor(waktu/60).toString().padStart(2,"0")
let d=(waktu%60).toString().padStart(2,"0")

timer.innerHTML=m+":"+d

if(waktu<=0){

clearInterval(timerInterval)

alert("Waktu habis, tes otomatis selesai")

selesaiTes(true)

}

},1000)

}

/* ================= CEK SOAL BELUM DIJAWAB ================= */

function cekKosong(){

let kosong=0

soal.forEach((s,i)=>{
if(jawaban[i]==null){
kosong++
}
})

return kosong

}

/* ================= SELESAI TES ================= */

function selesaiTes(force=false){

if(!force){

let kosong=cekKosong()

if(kosong>0){

let lanjut=confirm(
"Masih ada "+kosong+" soal belum dijawab.\nTetap ingin menyelesaikan tes?"
)

if(!lanjut) return

}

}

clearInterval(timerInterval)

let skor=0

soal.forEach((s,i)=>{
if(jawaban[i]==s.k){
skor++
}
})

let nilaiAkhir=Math.round((skor/soal.length)*100)

let data=JSON.parse(localStorage.getItem("nilai"))||[]

data.push({
nama:nama.value,
kelas:kelas.value,
nilai:nilaiAkhir
})

localStorage.setItem("nilai",JSON.stringify(data))

localStorage.removeItem("jawabanSiswa")

tesPage.style.display="none"
hasilPage.style.display="block"

nilai.innerHTML="<h2>"+nilaiAkhir+"</h2>"

}

/* ================= LOGIN GURU ================= */

function cekPassword(){

if(passwordGuru.value===PASSWORD_GURU){

loginGuru.style.display="none"
dashboard.style.display="block"

timerInfo.innerHTML = localStorage.getItem("timerTes") || 20

buatGrafik()
buatStatistik()
buatRekap()

}else{
alert("Password salah")
}

}

/* ================= GRAFIK ================= */

function buatGrafik(){

let data=JSON.parse(localStorage.getItem("nilai"))||[]

let nama=[]
let nilai=[]

data.forEach(d=>{
nama.push(d.nama)
nilai.push(d.nilai)
})

new Chart(grafikNilai,{
type:"bar",
data:{
labels:nama,
datasets:[{
label:"Nilai",
data:nilai
}]
}
})

}

/* ================= STATISTIK ================= */

function buatStatistik(){

let data=JSON.parse(localStorage.getItem("nilai"))||[]

if(data.length==0)return

let arr=data.map(d=>d.nilai)

let avg=arr.reduce((a,b)=>a+b)/arr.length

statistik.innerHTML="Rata-rata: "+avg.toFixed(1)

}

/* ================= REKAP + PERINGKAT ================= */

function buatRekap(){

let data=JSON.parse(localStorage.getItem("nilai"))||[]

data.sort((a,b)=>b.nilai-a.nilai)

let html=`
<h3>Rekap Nilai Siswa</h3>
<table border="1" cellpadding="6">
<tr>
<th>Peringkat</th>
<th>Nama</th>
<th>Kelas</th>
<th>Nilai</th>
</tr>
`

data.forEach((d,i)=>{

html+=`
<tr>
<td>${i+1}</td>
<td>${d.nama}</td>
<td>${d.kelas}</td>
<td>${d.nilai}</td>
</tr>
`

})

html+="</table>"

statistik.innerHTML+=html

}

/* ================= EXPORT ================= */

function exportExcel(){

let data=JSON.parse(localStorage.getItem("nilai"))||[]

let csv="Nama,Kelas,Nilai\n"

data.forEach(d=>{
csv+=d.nama+","+d.kelas+","+d.nilai+"\n"
})

let blob=new Blob([csv])

let a=document.createElement("a")

a.href=URL.createObjectURL(blob)

a.download="nilai.csv"

a.click()

}

function resetNilai(){
localStorage.removeItem("nilai")
alert("Nilai dihapus")
}

/* ================= EDIT SOAL ================= */

function tampilSoalGuru(){

dashboard.style.display="none"
editSoalPage.style.display="block"

renderSoal()

}

function renderSoal(){

let html=""

soal.forEach((s,i)=>{

html+=`
<div class="soalItem">
<b>${i+1}. ${s.t}</b><br>
A. ${s.a[0]}<br>
B. ${s.a[1]}<br>
C. ${s.a[2]}<br>
Kunci: ${s.k}
<br>
<button onclick="hapusSoal(${i})">Hapus</button>
</div>
`

})

listSoal.innerHTML=html

}

function tambahSoal(){

let obj={
t:soalBaru.value,
a:[a1.value,a2.value,a3.value],
k:Number(kunci.value),
bobot:Number(bobot.value)
}

soal.push(obj)

renderSoal()

soalBaru.value=""
a1.value=""
a2.value=""
a3.value=""
kunci.value=""
bobot.value=""

alert("Soal ditambahkan")

}

function hapusSoal(i){

soal.splice(i,1)

renderSoal()

}

function kembaliDashboard(){

editSoalPage.style.display="none"
dashboard.style.display="block"

}

/* ================= TIMER GURU ================= */

function simpanTimer(){

let menit=setTimer.value

if(menit=="" || menit<=0){
alert("Masukkan waktu yang valid")
return
}

localStorage.setItem("timerTes",menit)

timerInfo.innerHTML=menit

alert("Timer berhasil disimpan")

}