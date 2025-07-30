const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

class MusicPlayer {
  NEXT = 1;
  PREV = -1;
  PREV_THROTLE = 2;

  _currenIndex = 0;
  _isPlaysong = false;
  _isLoop = localStorage.getItem("loop") === "true";
  _isRandom = localStorage.getItem("random") === "true";

  constructor() {
    this._playlistElement = $("#playlist");
    this._btnTogglePlay = $("#btn-toggle-play");
    this._nameSong = $("#name-song");
    this._audioMusic = $("#audioMusic");
    this._iconPlay = $("#btn-toggle-play i");
    this._btnNext = $("#btn-next");
    this._btnPrev = $("#btn-prev");
    this._btnLoop = $("#btn-loop");
    this._btnRandom = $("#btn-random");
    this._progress = $("#progress");
    this._cd = $("#cd");
    this._cdThumb = $("#cd-thumb");
    this._cdImg = $("#img-cd");

    this.songs = [
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
    ];
  }

  // hàm xử bắt đầu
  start() {
    this._render();
    this._playBack();
    this._handleshrinkCdOnScroll();
    this._handlerotateCd();
    this._handleSongClick();

    // Dom Event
    this._btnTogglePlay.onclick = () => this._togglePlay();

    // Khi music chạy thì thay đổi class icon
    this._audioMusic.onplay = () => {
      this._iconPlay.classList.remove("fa-play");
      this._iconPlay.classList.add("fa-pause");
      this._isPlaysong = true;
      this._rotateCd.play();
    };

    // Khi music tắt thì thay đổi class icon
    this._audioMusic.onpause = () => {
      this._iconPlay.classList.remove("fa-pause");
      this._iconPlay.classList.add("fa-play");
      this._isPlaysong = false;
      this._rotateCd.pause();
    };

    // xử lý khi next bài hát
    this._btnNext.onclick = () => this._handleControl(this.NEXT);
    // hàm sử lý khi prev bài hát
    this._btnPrev.onclick = () => this._handleControl(this.PREV);

    // xử lý ấn vào nút Loop
    this._btnLoop.onclick = () => {
      this._isLoop = !this._isLoop;
      this._setLoopStart();
      localStorage.setItem("loop", this._isLoop);
    };

    // xử lý bấm vào nút random
    this._btnRandom.onclick = () => {
      this._isRandom = !this._isRandom;
      this._setRandomstart();
    };

    // xử lý thởi gian chạy của bài nhạc
    this._audioMusic.ontimeupdate = () => {
      if (this._progress.seeking) return;
      const progressTime =
        (this._audioMusic.currentTime / this._audioMusic.duration) * 100;
      this._progress.value = progressTime || 0;
    };

    // xử lý bấm chuột xuống thanh progress
    this._progress.onmousedown = () => {
      this._progress.seeking = true;
    };

    // xử lý nhả chuột xuống thanh progress
    this._progress.onmouseup = () => {
      const nextStep = +this._progress.value;
      const nextTiem = (this._audioMusic.duration / 100) * nextStep;
      this._audioMusic.currentTime = nextTiem;
      this._progress.seeking = false;
    };

    // xử lý khi kết thúc bài thì next
    this._audioMusic.onended = () => {
      this._handleControl(this.NEXT);
      this._isPlaysong = true;
    };
  }

  // xử lý logic nút next và Prev
  _handlebtnNextandPrev() {
    this._isPlaysong = true;
    this._currenIndex =
      (this._currenIndex + this.songs.length) % this.songs.length;
    this._playBack();
    this._render();
  }

  // tối ưu logic khi khi ấn vào random vào nút next và prev
  _handleControl(step) {
    const shouldReset = this._audioMusic.currentTime > this.PREV_THROTLE;
    if (step === this.PREV && shouldReset) {
      this._audioMusic.currentTime = 0;
      return;
    }

    if (this._isRandom) {
      this._currenIndex = this._getRanDomIndex();
    } else {
      this._currenIndex += step;
    }

    this._handlebtnNextandPrev();
  }

  // hàm xử lý lặp chùng index lấy ra random index
  _getRanDomIndex() {
    if (this.songs.length === 1) return this._currenIndex;

    let indexRandom;
    do {
      indexRandom = Math.floor(Math.random() * this.songs.length);
    } while (this._currenIndex === indexRandom);

    return indexRandom;
  }

  // xửa lý khi active và Loop
  _setLoopStart() {
    this._btnLoop.classList.toggle("active", this._isLoop);
    this._audioMusic.loop = this._isLoop;
  }

  _setRandomstart() {
    this._btnRandom.classList.toggle("active", this._isRandom);
    localStorage.setItem("random", this._isRandom);
  }

  // hàm xử lý khi load thì có thay đổi text Name song
  _playBack() {
    const currenName = this._getCurrentSong();
    this._nameSong.textContent = currenName.name;
    this._cdImg.src = currenName.img;
    this._audioMusic.src = currenName.path;
    this._setLoopStart();
    this._setRandomstart();

    // khi bắt đầu phát
    this._audioMusic.oncanplay = () => {
      if (this._isPlaysong) {
        this._audioMusic.play();
      }
    };
  }

  // hàm sử lý bài hát hiện tại
  _getCurrentSong() {
    return this.songs[this._currenIndex];
  }

  // hàm xử lý bấm nút Play
  _togglePlay() {
    this._audioMusic.paused
      ? this._audioMusic.play()
      : this._audioMusic.pause();
  }

  // hàm xử lý khi cuộn thu nhỏ phóng to phần header
  _handleshrinkCdOnScroll() {
    const cdWidth = this._cd.offsetWidth;
    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWith = cdWidth - scrollTop;
      this._cd.style.width = newCdWith > 0 ? `${newCdWith}px` : 0;
      this._cd.style.opacity = newCdWith / cdWidth;
    };
  }

  // hàm xử lý quay đĩa
  _handlerotateCd() {
    this._rotateCd = this._cdThumb.animate(
      [{ transform: "rotate(360deg)" }],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    this._rotateCd.pause();
  }

  _handleSongClick() {
    this._playlistElement.onclick = (e) => {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // nếu khonong phải bài đang active thì sử lý logic
        if (songNode) {
          this._currenIndex = +songNode.dataset.index;
          console.log(this._currenIndex);
          this._playBack();
          this._render();
          this._isPlaysong = true;
        }
        // xử lý khi bấm bào option
        // if(e.target.closest(".option")) { ... }
      }
    };
  }

  // hàm xử lý render
  _render() {
    const html = this.songs
      .map((song, index) => {
        const isActive = index === this._currenIndex;
        return `
        <div class="song ${isActive ? "active" : ""}" data-index="${index}">
          <div class="thumb">
            <img src="${song.img}" alt="">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>`;
      })
      .join("");

    this._playlistElement.innerHTML = html;
  }
}

const musicPlayer = new MusicPlayer();
console.log(musicPlayer);
musicPlayer.start();
