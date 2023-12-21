document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    cordova.plugin.http.setDataSerializer('json');
    let btnNovo = document.getElementById('btnNovo');
    let btnFoto = document.getElementById('btnFoto');
    let btnSalvar = document.getElementById('btnSalvar');
    let btnExcluir = document.getElementById('btnExcluir');
    let btnCancelar = document.getElementById('btnCancelar');
    let PIZZARIA_ID = 'pizzaria_do_gabriel';
    let applista = document.getElementById('applista');
    let appcadastro = document.getElementById('appcadastro');
    let listaPizzasCadastradas = [];
    let pizzaEmEdicao = null;

  function exibirTelaCadastro() {
      applista.style.display = 'none';
      appcadastro.style.display = 'flex';
  }

  function exibirTelaLista() {
    applista.style.display = 'flex';
    appcadastro.style.display = 'none';
}

function carregarPizzas() {

  cordova.plugin.http.get('https://pedidos-pizzaria.glitch.me/admin/pizzas/' + PIZZARIA_ID, {}, {}, function(response) {
      if (response.data !== '') {
          listaPizzasCadastradas = JSON.parse(response.data);

          listaPizzas.innerHTML = '';

          listaPizzasCadastradas.forEach((item, idx) => {
              let novo = document.createElement('div');
              novo.classList.add('linha');
              novo.innerHTML = item.pizza;
              novo.id = idx;
              novo.onclick = function () {
                  carregarDadosPizza(novo.id);
              };

              listaPizzas.appendChild(novo);
          });
      }
  }, function(response) {
      console.log(response.error);
  }
  );
}

function carregarDadosPizza(id) {
  if (id >= 0 && id < listaPizzasCadastradas.length) {
      pizzaEmEdicao = listaPizzasCadastradas[id];

      document.getElementById('pizza').value = pizzaEmEdicao.pizza;
      document.getElementById('preco').value = pizzaEmEdicao.preco;
      document.getElementById('imagem').style.backgroundImage = `url(${pizzaEmEdicao.imagem})`;

      exibirTelaCadastro();
  }
}

    btnNovo.addEventListener('click', function(){
        document.getElementById('pizza').value = '';
        document.getElementById('preco').value = '';
        document.getElementById('imagem').style.backgroundImage = '';
        exibirTelaCadastro();
  });

    btnCancelar.addEventListener('click', function(){
        exibirTelaLista();
  });

  btnFoto.addEventListener('click', function() {
    navigator.camera.getPicture(onSuccess, onFail, {  
        quality: 50, 
        destinationType: Camera.DestinationType.DATA_URL 
    });  
    
    function onSuccess(imageData) { 
        imagem.style.backgroundImage = "url('data:image/jpeg;base64," + imageData + "')"; 
    }  
    
    function onFail(message) { 
        alert('Failed because: ' + message); 
    } 
  });

  btnSalvar.addEventListener('click', function () {

    if (pizzaEmEdicao) {
        editarDados();
    }
    else {
        enviarDados();
    }
    
    function enviarDados() {
        cordova.plugin.http.post(
        'https://pedidos-pizzaria.glitch.me/admin/pizza/',  // URL
        {  // Request data
            pizzaria: PIZZARIA_ID,
            pizza: pizza.value,
            preco: preco.value,
            imagem: imagem.style.backgroundImage
        },
        {},  // Headers (you can pass headers if needed)
        function(response) {  // Success callback
            alert(response.status);
            exibirTelaLista();
            carregarPizzas();
        },
        function(response) {  // Error callback
            alert(response.error);
        }
    )};
    
    function editarDados() 
        {cordova.plugin.http.put(
        'https://pedidos-pizzaria.glitch.me/admin/pizza/',  // URL
        {  // Request data
            pizzaid: pizzaEmEdicao._id,
            pizzaria: PIZZARIA_ID,
            pizza: pizza.value,
            preco: preco.value,
            imagem: imagem.style.backgroundImage
        },
        {},  // Headers (you can pass headers if needed)
        function(response) {  // Success callback
            alert(response.status);
            exibirTelaLista();
            carregarPizzas();
            pizzaEmEdicao = null;
        },
        function(response) {  // Error callback
            alert(response.error);
        }
    )};    
});

  btnExcluir.addEventListener('click', function () {
    if (pizzaEmEdicao) {
        let pizzaId = pizzaEmEdicao.pizza;

        cordova.plugin.http.delete('https://pedidos-pizzaria.glitch.me/admin/pizza/' + PIZZARIA_ID + '/' + pizzaId, {}, {}, function(response) {
            if (response.status === 200) {
                carregarPizzas();
                exibirTelaLista();
            }
        }, function(error) {
            console.error('HTTP request error:', error);
        });
        
    }
});

  carregarPizzas();

  exibirTelaLista();

}