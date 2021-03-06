window.onload = function () {
  var myId = '';
  var socket = {};
  let obj = document.querySelector('.objeto');
  let label = document.querySelector('.label');

  let skin = document.querySelector('.skin');
  let gemidaoativo = false;
  let botaoAtivo = false;

  let timeout = 0;
  let btnplay = document.querySelector('.btn-play');
  $('input[name=nome]').focus()
  obj.addEventListener('click', function () {
    press();
  });

  // function timerSkin() {
  //   //skin.style.height = heightSkin + 'px';
  //   if (heightSkin === 0) {
  //     // playAudio();
  //   }
  // }

  function press() {
    // debugger;
    socket.emit('press', {
      username: myId,
      sendDate: new Date(),
    });
    botaoAtivo = false;
    clearTimeout(timeout);
    obj.classList.add('v-none');
  }

  function verifyExpiration(experation) {
    const interval = setInterval(() => {
      const now = new Date();
      const expires = new Date(experation);
      if (now >= expires) {
        press()
        clearInterval(interval)
      }
    }, 500)
  }

  function register() {
    socket.on(myId, function (data) {
      botaoAtivo = true;
      console.log('SORTEADO', data)
      timeout = setTimeout(() => {
        if (!botaoAtivo) return;
        press();
      }, 3000);

      if (data === 'HASFAIL' || data === 'ENDGAME') {
        if (gemidaoativo) return;
        gemidaoativo = true;
        botaoAtivo = false;
        playAudio();
        // if (!data == 'ENDGAME') return
        // socket.emit('disconnect:user', {
        //   username: myId,
        // })

        return;
      }
      obj.classList.remove('v-none');
    });

    socket.on('expiration-date', function (data) {
      if (!data) return;
      verifyExpiration(data)
    });
  }
  let labels = [
    'Vai logo!',
    'Está acabando',
    'Aperta esse botão.',
    'Seu lerdo!',
    'Sua mãe chora no banho',
    'Você é só isso?',
    'Sua batata está assando em!',
    'Literalmente rsrs',
  ];

  let i = 0;
  setInterval(function () {
    label.innerHTML = labels[i];
    i = i + 1;
    if (i == labels.length) {
      i = 0;
    }
  }, 1000);

  changeBg();
  var url = 'http://localhost:3000/';
  if (location.href.indexOf(url) !== -1) socket = io.connect(url);
  else socket = io.connect('https://originalpotato.herokuapp.com/');



  let form = document.querySelector('.form');
  let btn = document.querySelector('.btn');
  let nome = document.querySelector('.nome');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let data = nome.value;
    form.classList.add('none');
    myId = data + new Date().getTime();
    socket.emit('add-user', {
      username: myId,
      sendDate: new Date(),
    });
    register();
  });
};

function changeBg() {
  let body = document.querySelector('body');
  let images = ['/img/potato.gif', '/img/potato2.gif'];

  let i = 0;
  setInterval(function () {
    body.style.backgroundImage = 'url(' + images[i] + ')';
    i = i + 1;
    if (i == images.length) {
      i = 0;
    }
  }, 1000);
}

var url = '../audio/gemidao2.mp3';
createjs.Sound.registerSound(url, 'omg');

function playAudio() {
  createjs.Sound.play('omg');
  let body = document.querySelector('body');
  body.classList.add('fail');
}