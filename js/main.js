const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const musicPlayer = {
  _playlistElement: $("#playlist"),
  _btnTogglePlay: $("#btn-toggle-play"),
  _currenIndex: 0,
  _nameSong: $("#name-song"),
  _audioMusic: $("#audioMusic"),
  _iconPlay: $("#btn-toggle-play i"),
  _btnNext: $("#btn-next"),
  _btnPrev: $("#btn-prev"),
  _isPlaysong: false,
  songs: [
    {
      id: 1,
      path: "./assest/music/BinhYenNhungPhutGiay-SonTungMTP-4915711.mp3",
      img: "./assest/img/bìnhyennhungphutgiay.jpg",
      name: "Bình Yên Nhưng Phút Giây",
      singer: "sơn tùng MTP",
    },
    {
      id: 1,
      path: "./assest/music/ChacAiDoSeVeNewVersion-SonTungMTP-3698905.mp3",
      img: "./assest/img/chacaidoseve.jpg",
      name: "Chắc Ai Đó Sẽ Về",
      singer: "sơn tùng MTP",
    },
    {
      id: 2,
      path: "./assest/music/ChayNgayDiOnionnRemix-SonTungMTPOnionn-5521659.mp3",
      img: "./assest/img/Chay_ngay_di.jpg",
      name: "Chạy Ngay Đi",
      singer: "sơn tùng MTP",
    },
    {
      id: 3,
      path: "./assest/music/ChungTaKhongThuocVeNhau-SonTungMTP-4528181.mp3",
      img: "./assest/img/chungtakhongthuocvenhau.jpg",
      name: "Chúng Ta Không Thuộc Về Nhau",
      singer: "sơn tùng MTP",
    },
    {
      id: 4,
      path: "./assest/music/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3",
      img: "./assest/img/haytraochoanh.jpg",
      name: "Hãy Trao Cho Anh",
      singer: "sơn tùng MTP",
    },
    {
      id: 5,
      path: "./assest/music/NangAmXaDanOnionnRemix-SonTungMTPOnionn-5947142.mp3",
      img: "./assest/img/nắng ấm xa dàn.jpg",
      name: "Nắng Ấm Xa Dần",
      singer: "sơn tùng MTP",
    },
    {
      id: 6,
      path: "./assest/music/UpgradeRememberMe-SonTungMTP-4263862.mp3",
      img: "./assest/img/RememberMe.jpg",
      name: "Remember Me",
      singer: "sơn tùng MTP",
    },
  ],
  // hàm xử bắt đầu
  start() {
    this._render();
    this._loadCurrentSong();
    // Dom Event
    this._btnTogglePlay.onclick = this._togglePlay.bind(this);
    // Khi music chạy thì thay đổi class icon
    this._audioMusic.onplay = () => {
      this._iconPlay.classList.remove("fa-play");
      this._iconPlay.classList.add("fa-pause");
      // khi phát thì là true
      this._isPlaysong = true;
    };
    // Khi music tắt thì thay đổi class icon
    this._audioMusic.onpause = () => {
      this._iconPlay.classList.remove("fa-pause");
      this._iconPlay.classList.add("fa-play");
      // khi đóng thì là false
      this._isPlaysong = false;
    };
    // xử lý khi next bài hát
    this._btnNext.onclick = () => {
      this._currenIndex++; 
      this._handlebtnNext();
    }
    // hàm sử lý khi prev bài hát
    this._btnPrev.onclick = () => {
      this._currenIndex--;
      this._handlebtnPrev();
    }
  },
  // xử lý logic nút next
  _handlebtnNext(){
    this._currenIndex = (this._currenIndex + this.songs.length) % this.songs.length;
    this._loadCurrentSong();
    this._render();
  },
  //xử lý logic nút Prev
  _handlebtnPrev(){
    this._currenIndex = (this._currenIndex + this.songs.length) % this.songs.length;
    console.log(this._currenIndex)
    this._loadCurrentSong();
    this._render();
  },
  // hàm xử lý khi load thì có thay đổi text Name song
  _loadCurrentSong() {
    const currenName = this._getCurrentSong();
    this._nameSong.textContent = currenName.name;
    this._audioMusic.src = currenName.path;

    // khi bắt đầu phát
    this._audioMusic.oncanplay = () =>{
        if(this._isPlaysong){
          this._audioMusic.play();
        }
    }

  },
  // hàm sử lý bài hát hiện tại
  _getCurrentSong() {
    return this.songs[this._currenIndex];
  },
  // hàm xử lý bấm nút Play
  _togglePlay() {
    if (this._audioMusic.paused) {
      this._audioMusic.play();
    } else {
      this._audioMusic.pause();
    }
  },
  // hàm xử lý render
  _render() {
    const html = this.songs
      .map((song, index) => {
        const isActive = index === this._currenIndex;
        return `
             <div class="song ${isActive ? "active" : ""}">
          <div
            class="thumb"
          >
          <img src="${song.img}" alt="">
        </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
        `;
      })
      .join("");
    this._playlistElement.innerHTML = html;
  },
};
console.log(musicPlayer);
musicPlayer.start();
