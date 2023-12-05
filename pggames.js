require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const database = require('./database/dbconfig')
const util = require("util")
const crypto = require('crypto')
const request = require("request")
const base64 = require('base-64');
const colors = require('colors');
const { appendFile, readFile, writeFile } = require("fs/promises");


function formatarValorMonetario(valor) {
  return `${valor.toFixed(2)}`;
}

process.env.TZ = 'America/Sao_Paulo';

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function novaData() {
  var data = new Date();
  var dia = data.getDate()
  var mes = data.getMonth() + 1
  var ano = data.getFullYear()
  var horas = data.getHours();
  var minutos = data.getMinutes();

  if (horas.toString().length == 1) {
    var horas = `0${horas}`
  }

  if (minutos.toString().length == 1) {
    var minutos = `0${minutos}`
  }

  if (dia.toString().length == 1) {
    var dia = `0${dia}`
  }

  if (mes.toString().length == 1) {
    var mes = `0${mes}`
  }

  return `${dia}-${mes}-${ano} ${horas}:${minutos}`
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function __curl($options) {
  $rejectUnauthorized = false;
  return new Promise((resolve, reject) => {
    request($options, (err, res, body) => {
      resolve({ err: err, res: res, body: body })
    })
  })
}

function getstr(index, index2, index3, value) {
  try {
    return { success: true, message: index.split(index2)[value].split(index3)[0] };
  } catch (e) {
    return { success: false };
  }
}

const porta = process.env.PORTA

const query = util.promisify(database.query).bind(database);

setInterval(async function () {
  const ficarativo = await query(`select count(id) from apis`)
}, 5000);


async function gravaLog(usuario, acao, valor) {
  var usuariolog = usuario
  var acaofeita = acao
  var valorinfo = valor

  if (valorinfo == undefined || valorinfo == null) {
    var valorinfo = ''
  }

  var gravalog = await query(`insert into db_usuarios_logs (username, data, acao, obs1) VALUES ('${usuariolog}','${novaData()}', '${acaofeita}', '${valorinfo}')`)

}

app.use(bodyParser.urlencoded({ extended: true })) //FAZ COM QUE OS DADOS DO POST SEJAM RECUPERADOS
app.use(bodyParser.json()) //FAZ COM QUE OS DADOS TAMBEM POSSAM SER RECEBIDOS EM JSON
app.use(cors())
app.use(
  express.json({
    limit: '5mb',
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.get('/tiger/:id', async (req, res) => {
  var tokenusuario = req.params.id
})

app.get('/tiger/icons/:id', async (req, res) => {

  try {

    var resultado = `{
      "success": true,
      "data": [{
          "icon_name": "Symbol_0",
          "win_1": 0,
          "win_2": 0,
          "win_3": 250,
          "win_4": 0,
          "win_5": 0,
          "win_6": 0,
          "wild_card": null,
          "free_spin": null,
          "free_num": 0,
          "scaler_spin": null
      }, {
          "icon_name": "Symbol_1",
          "win_1": 0,
          "win_2": 0,
          "win_3": 100,
          "win_4": 0,
          "win_5": 0,
          "win_6": 0,
          "wild_card": null,
          "free_spin": null,
          "free_num": 0,
          "scaler_spin": null
      }, {
          "icon_name": "Symbol_2",
          "win_1": 0,
          "win_2": 0,
          "win_3": 25,
          "win_4": 0,
          "win_5": 0,
          "win_6": 0,
          "wild_card": null,
          "free_spin": null,
          "free_num": 0,
          "scaler_spin": null
      }, {
          "icon_name": "Symbol_3",
          "win_1": 0,
          "win_2": 0,
          "win_3": 10,
          "win_4": 0,
          "win_5": 0,
          "win_6": 0,
          "wild_card": null,
          "free_spin": null,
          "free_num": 0,
          "scaler_spin": null
      }, {
          "icon_name": "Symbol_4",
          "win_1": 0,
          "win_2": 0,
          "win_3": 8,
          "win_4": 0,
          "win_5": 0,
          "win_6": 0,
          "wild_card": null,
          "free_spin": null,
          "free_num": 0,
          "scaler_spin": null
      }, {
          "icon_name": "Symbol_5",
          "win_1": 0,
          "win_2": 0,
          "win_3": 5,
          "win_4": 0,
          "win_5": 0,
          "win_6": 0,
          "wild_card": null,
          "free_spin": null,
          "free_num": 0,
          "scaler_spin": null
      }, {
          "icon_name": "Symbol_6",
          "win_1": 0,
          "win_2": 0,
          "win_3": 3,
          "win_4": 0,
          "win_5": 0,
          "win_6": 0,
          "wild_card": null,
          "free_spin": null,
          "free_num": 0,
          "scaler_spin": null
      }, {
          "icon_name": "Symbol_e",
          "win_1": 0,
          "win_2": 0,
          "win_3": 0,
          "win_4": 0,
          "win_5": 0,
          "win_6": 0,
          "wild_card": null,
          "free_spin": null,
          "free_num": 0,
          "scaler_spin": null
      }],
      "message": "List icons success"
  }`

    var encodaresultado = JSON.parse(resultado)

    res.send(encodaresultado)

  } catch (error) {
    res.send({ status: false, message: 'Ocorreu um erro' })
  }

})

app.get("/tiger/session/:id", async (req, res) => {

  try {

    var tokenusuario = req.params.id

    if (!tokenusuario) {
      return res.send({ status: false, message: 'Usuário não encontrado!' })
    }

    var userid = base64.decode(tokenusuario)

    const consultausuario = await query(`SELECT * FROM users WHERE userid = '${userid}'`)

    if (consultausuario.length == 0) {
      return res.send({ status: false, message: 'Usuário não encontrado!' })
    }


    var saldousuario = consultausuario[0].balance
    var usuarionome = consultausuario[0].username

    var metadados = `{
      "success": true,
      "data": {
        "user_name": "${usuarionome}",
        "credit": ${saldousuario},
        "num_line": 5,
        "line_num": 5,
        "bet_amount": 0.2,
        "free_num": 0,
        "free_total": 0,
        "free_amount": 0,
        "free_multi": 0,
        "freespin_mode": 0,
        "multiple_list": [],
        "credit_line": 1,
        "buy_feature": 50,
        "buy_max": 1300,
        "feature": {},
        "total_way": 0,
        "multipy": 0,
        "icon_data": [],
        "active_lines": [],
        "drop_line": [],
        "currency_prefix": "R$",
        "currency_suffix": "",
        "currency_thousand": ".",
        "currency_decimal": ",",
        "bet_size_list": [
          "0.2",
          "2",
          "20",
          "100"
        ],
        "previous_session": false,
        "game_state": null,
        "feature_symbol": "",
        "feature_result": {
          "left_feature": 9,
          "select_count": 0,
          "right_feature": 9,
          "select_finish": false,
          "access_feature": false
        }
      },
      "message": "Load sessions success"
    }`

    res.send(metadados)


  } catch (error) {
    res.send({ status: false, message: 'Ocorreu um erro' })
  }

})


app.post("/tiger/spin/:id", async (req, res) => {

  try {


    ///////////////////////////////// RETORNO DADOS USUARIO /////////////////////////////////
    var tokenusuario = req.params.id

    if (!tokenusuario) {
      return res.send({ status: false, message: 'Usuário não encontrado!' })
    }

    var userid = base64.decode(tokenusuario)

    const consultausuario = await query(`SELECT * FROM users WHERE userid = '${userid}'`)

    if (consultausuario.length == 0) {
      return res.send({ status: false, message: 'Usuário não encontrado!' })
    }

    var saldousuario = consultausuario[0].balance
    var saldobonus = consultausuario[0].balance_bonus
    var saldoreal = consultausuario[0].balance_real
	var saldos = saldobonus + saldoreal
    var usuarionome = consultausuario[0].username
	var referencia = consultausuario[0].referencia

    ///////////////////////////////// RETORNO DADOS USUARIO /////////////////////////////////


    ////////////////////////////////// BETS /////////////////////////////////////////////////
    var resultadoperdas = [
      `[["Symbol_5", "Symbol_3", "Symbol_6", "Symbol_2", "Symbol_2", "Symbol_1", "Symbol_3", "Symbol_4", "Symbol_3"], [], [], [], 1, 0]`,
      `[["Symbol_5", "Symbol_4", "Symbol_3", "Symbol_3", "Symbol_3", "Symbol_2", "Symbol_2", "Symbol_0", "Symbol_1"], [], [], [], 1, 0]`,
      `[["Symbol_5", "Symbol_1", "Symbol_3", "Symbol_1", "Symbol_4", "Symbol_6", "Symbol_3", "Symbol_6", "Symbol_1"], [], [], [], 1, 0]`,
      `[["Symbol_5", "Symbol_2", "Symbol_3", "Symbol_6", "Symbol_3", "Symbol_1", "Symbol_5", "Symbol_1", "Symbol_4"], [], [], [], 1, 0]`,
      `[["Symbol_3", "Symbol_6", "Symbol_5", "Symbol_1", "Symbol_6", "Symbol_6", "Symbol_6", "Symbol_5", "Symbol_0"], [], [], [], 1, 0]`,
      `[["Symbol_2", "Symbol_1", "Symbol_4", "Symbol_5", "Symbol_3", "Symbol_6", "Symbol_5", "Symbol_3", "Symbol_1"], [], [], [], 1, 0]`,
      `[["Symbol_4", "Symbol_1", "Symbol_2", "Symbol_3", "Symbol_4", "Symbol_3", "Symbol_6", "Symbol_4", "Symbol_5"], [], [], [], 1, 0]`,
      `[["Symbol_2", "Symbol_1", "Symbol_4", "Symbol_2", "Symbol_6", "Symbol_2", "Symbol_1", "Symbol_5", "Symbol_3"], [], [], [], 1, 0]`,
      `[["Symbol_6", "Symbol_1", "Symbol_5", "Symbol_3", "Symbol_1", "Symbol_3", "Symbol_3", "Symbol_6", "Symbol_3"], [], [], [], 1, 0]`,
      `[["Symbol_3", "Symbol_4", "Symbol_4", "Symbol_4", "Symbol_4", "Symbol_3", "Symbol_5", "Symbol_1", "Symbol_5"], [], [], [], 1, 0]`,
      `[["Symbol_3", "Symbol_5", "Symbol_1", "Symbol_6", "Symbol_5", "Symbol_4", "Symbol_6", "Symbol_1", "Symbol_2"], [], [], [], 1, 0]`,
      `[["Symbol_2", "Symbol_1", "Symbol_4", "Symbol_5", "Symbol_3", "Symbol_6", "Symbol_5", "Symbol_3", "Symbol_1"], [], [], [], 1, 0]`,
      `[["Symbol_2", "Symbol_1", "Symbol_4", "Symbol_5", "Symbol_3", "Symbol_6", "Symbol_5", "Symbol_3", "Symbol_1"], [], [], [], 1, 0]`,
      `[["Symbol_4", "Symbol_6", "Symbol_3", "Symbol_6", "Symbol_4", "Symbol_4", "Symbol_5", "Symbol_2", "Symbol_2"], [], [], [], 1, 0]`,
      `[["Symbol_2", "Symbol_4", "Symbol_1", "Symbol_3", "Symbol_4", "Symbol_6", "Symbol_6", "Symbol_0", "Symbol_3"], [], [], [], 1, 0]`,
      `[["Symbol_3", "Symbol_4", "Symbol_1", "Symbol_6", "Symbol_4", "Symbol_5", "Symbol_2", "Symbol_1", "Symbol_6"], [], [], [], 1, 0]`,
      `[["Symbol_6", "Symbol_0", "Symbol_1", "Symbol_3", "Symbol_4", "Symbol_2", "Symbol_3", "Symbol_2", "Symbol_1"], [], [], [], 1, 0]`,
      `[["Symbol_3", "Symbol_6", "Symbol_5", "Symbol_5", "Symbol_3", "Symbol_4", "Symbol_5", "Symbol_2", "Symbol_2"], [], [], [], 1, 0]`,
      `[["Symbol_5", "Symbol_3", "Symbol_6", "Symbol_2", "Symbol_2", "Symbol_1", "Symbol_3", "Symbol_4", "Symbol_3"], [], [], [], 1, 0]`,
      `[["Symbol_5", "Symbol_4", "Symbol_3", "Symbol_3", "Symbol_3", "Symbol_2", "Symbol_2", "Symbol_0", "Symbol_1"], [], [], [], 1, 0]`,
      `[["Symbol_5", "Symbol_1", "Symbol_3", "Symbol_1", "Symbol_4", "Symbol_6", "Symbol_3", "Symbol_6", "Symbol_1"], [], [], [], 1, 0]`,
      `[["Symbol_5", "Symbol_2", "Symbol_3", "Symbol_6", "Symbol_3", "Symbol_1", "Symbol_5", "Symbol_1", "Symbol_4"], [], [], [], 1, 0]`,
      `[["Symbol_3", "Symbol_6", "Symbol_5", "Symbol_1", "Symbol_6", "Symbol_6", "Symbol_6", "Symbol_5", "Symbol_0"], [], [], [], 1, 0]`,
      `[["Symbol_2", "Symbol_1", "Symbol_4", "Symbol_5", "Symbol_3", "Symbol_6", "Symbol_5", "Symbol_3", "Symbol_1"], [], [], [], 1, 0]`,
      `[["Symbol_4", "Symbol_1", "Symbol_2", "Symbol_3", "Symbol_4", "Symbol_3", "Symbol_6", "Symbol_4", "Symbol_5"], [], [], [], 1, 0]`,
      `[["Symbol_2", "Symbol_1", "Symbol_4", "Symbol_2", "Symbol_6", "Symbol_2", "Symbol_1", "Symbol_5", "Symbol_3"], [], [], [], 1, 0]`,
      `[["Symbol_6", "Symbol_1", "Symbol_5", "Symbol_3", "Symbol_1", "Symbol_3", "Symbol_3", "Symbol_6", "Symbol_3"], [], [], [], 1, 0]`,
      `[["Symbol_3", "Symbol_4", "Symbol_4", "Symbol_4", "Symbol_4", "Symbol_3", "Symbol_5", "Symbol_1", "Symbol_5"], [], [], [], 1, 0]`,
      `[["Symbol_3", "Symbol_5", "Symbol_1", "Symbol_6", "Symbol_5", "Symbol_4", "Symbol_6", "Symbol_1", "Symbol_2"], [], [], [], 1, 0]`,
      `[["Symbol_2", "Symbol_1", "Symbol_4", "Symbol_5", "Symbol_3", "Symbol_6", "Symbol_5", "Symbol_3", "Symbol_1"], [], [], [], 1, 0]`,
      `[["Symbol_2", "Symbol_1", "Symbol_4", "Symbol_5", "Symbol_3", "Symbol_6", "Symbol_5", "Symbol_3", "Symbol_1"], [], [], [], 1, 0]`,
      `[["Symbol_4", "Symbol_6", "Symbol_3", "Symbol_6", "Symbol_4", "Symbol_4", "Symbol_5", "Symbol_2", "Symbol_2"], [], [], [], 1, 0]`,
      `[["Symbol_2", "Symbol_4", "Symbol_1", "Symbol_3", "Symbol_4", "Symbol_6", "Symbol_6", "Symbol_0", "Symbol_3"], [], [], [], 1, 0]`,
      `[["Symbol_3", "Symbol_4", "Symbol_1", "Symbol_6", "Symbol_4", "Symbol_5", "Symbol_2", "Symbol_1", "Symbol_6"], [], [], [], 1, 0]`,
      `[["Symbol_6", "Symbol_0", "Symbol_1", "Symbol_3", "Symbol_4", "Symbol_2", "Symbol_3", "Symbol_2", "Symbol_1"], [], [], [], 1, 0]`,
    ]

    var resultadoganhos = [
      `[["Symbol_6","Symbol_6","Symbol_6","Symbol_1","Symbol_4","Symbol_4","Symbol_1","Symbol_4","Symbol_2"], [1 , 2, 3], 2, 0, 3, 3]`,
      `[["Symbol_5","Symbol_0","Symbol_4","Symbol_5","Symbol_0","Symbol_5","Symbol_5","Symbol_0","Symbol_1"], [4 , 5, 6], 1, 0, 5, 5]`,
      `[["Symbol_5","Symbol_2","Symbol_5","Symbol_0","Symbol_6","Symbol_0","Symbol_4","Symbol_3","Symbol_6"], [4 , 5, 6], 1, 0, 3, 3]`,
      `[["Symbol_4","Symbol_6","Symbol_0","Symbol_6","Symbol_4","Symbol_6","Symbol_5","Symbol_5","Symbol_5"], [7 , 8, 9], 3, 0, 5, 5]`,
      `[["Symbol_5","Symbol_5","Symbol_5","Symbol_6","Symbol_1","Symbol_6","Symbol_3","Symbol_1","Symbol_6"], [1 , 2, 3], 2, 0, 5, 5]`,
      `[["Symbol_5","Symbol_5","Symbol_5","Symbol_6","Symbol_1","Symbol_6","Symbol_3","Symbol_1","Symbol_6"], [1, 2 ,3], 2, 0, 5, 3]`,
      `[["Symbol_4","Symbol_1","Symbol_6","Symbol_5","Symbol_2","Symbol_6","Symbol_6","Symbol_6","Symbol_6"], [7 , 8, 9], 3, 0, 3, 3]`,
      `[["Symbol_2","Symbol_6","Symbol_0","Symbol_4","Symbol_0","Symbol_4","Symbol_6","Symbol_2","Symbol_5"], [3 , 5, 7], 5, 0, 3, 11]`,
      `[["Symbol_6","Symbol_6","Symbol_6","Symbol_6","Symbol_5","Symbol_4","Symbol_5","Symbol_5","Symbol_4"], [1 , 2, 3], 2, 0, 3, 3]`,
      `[["Symbol_6","Symbol_5","Symbol_6","Symbol_6","Symbol_6","Symbol_6","Symbol_6","Symbol_2","Symbol_6"], [1 , 3, 4 ,5, 6, 7, 9], 9, 0, 9, 9]`,
      `[["Symbol_0","Symbol_1","Symbol_5","Symbol_1","Symbol_5","Symbol_5","Symbol_1","Symbol_5","Symbol_5"], [1, 5 ,9], 4, 0, 5, 5]`,
      `[["Symbol_6","Symbol_6","Symbol_0","Symbol_4","Symbol_4","Symbol_6","Symbol_3","Symbol_3","Symbol_1"], [1, 2, 3], 2, 0, 3, 3]`,
      `[["Symbol_6","Symbol_5","Symbol_0","Symbol_6","Symbol_6","Symbol_6","Symbol_6","Symbol_5","Symbol_3"], [3, 4, 5, 6, 7], 9, 0, 6, 6]`,
      `[["Symbol_6","Symbol_6","Symbol_6","Symbol_5","Symbol_6","Symbol_3","Symbol_2","Symbol_6","Symbol_5"], [1, 2, 3], 2, 0, 3, 3]`,
      `[["Symbol_2","Symbol_1","Symbol_2","Symbol_3","Symbol_3","Symbol_0","Symbol_3","Symbol_6","Symbol_6"], [4, 5, 6], 1, 0, 10, 10]`,
      `[["Symbol_4","Symbol_1","Symbol_5","Symbol_5","Symbol_5","Symbol_5","Symbol_5","Symbol_5","Symbol_5"], [3, 4, 5, 6, 7, 8, 9], 9, 0, 15, 15]`,
      `[["Symbol_6","Symbol_6","Symbol_0","Symbol_2","Symbol_6","Symbol_6","Symbol_2","Symbol_6","Symbol_6"], [1, 2, 3, 5, 9], 9, 0, 6, 6]`,
      `[["Symbol_0","Symbol_0","Symbol_5","Symbol_1","Symbol_6","Symbol_4","Symbol_3","Symbol_6","Symbol_2"], [1, 2, 3], 2, 0, 5, 5]`,
      `[["Symbol_4","Symbol_6","Symbol_4","Symbol_4","Symbol_4","Symbol_4","Symbol_4","Symbol_5","Symbol_4"], [1, 3, 4, 5, 6, 7, 9], 9, 0, 24, 24]`,
      `[["Symbol_6","Symbol_6","Symbol_0","Symbol_6","Symbol_4","Symbol_0","Symbol_6","Symbol_4","Symbol_6"], [1, 2, 3], 2, 0, 3, 3]`,
      `[["Symbol_2","Symbol_5","Symbol_5","Symbol_4","Symbol_0","Symbol_4","Symbol_3","Symbol_4","Symbol_3"], [4, 5, 6], 1, 0, 8, 8]`,
      `[["Symbol_5","Symbol_4","Symbol_0","Symbol_5","Symbol_5","Symbol_6","Symbol_5","Symbol_1","Symbol_4"], [3, 5, 7], 5, 0, 5, 5]`,
      `[["Symbol_6","Symbol_2","Symbol_5","Symbol_6","Symbol_6","Symbol_2","Symbol_0","Symbol_4","Symbol_4"], [7, 8 , 9], 3, 0, 8, 8]`,
      `[["Symbol_5","Symbol_5","Symbol_0","Symbol_5","Symbol_1","Symbol_0","Symbol_5","Symbol_6","Symbol_0"], [1, 2, 3], 2, 0, 5, 5]`,
      `[["Symbol_4","Symbol_5","Symbol_2","Symbol_2","Symbol_4","Symbol_4","Symbol_3","Symbol_3","Symbol_3"], [7, 8, 9], 3, 0, 10, 10]`,
      `[["Symbol_2","Symbol_6","Symbol_2","Symbol_1","Symbol_4","Symbol_5","Symbol_1","Symbol_1","Symbol_0"], [7, 8, 9], 3, 0, 100, 100]`,
      `[["Symbol_2","Symbol_6","Symbol_2","Symbol_1","Symbol_1","Symbol_0","Symbol_1","Symbol_4","Symbol_5"], [4, 5, 6], 3, 0, 100, 100]`,
      `[["Symbol_4","Symbol_5","Symbol_5","Symbol_5","Symbol_1","Symbol_6","Symbol_6","Symbol_6","Symbol_6"], [7, 8, 9], 3, 0, 3, 3]`,
      `[["Symbol_4","Symbol_6","Symbol_5","Symbol_4","Symbol_5","Symbol_5","Symbol_5","Symbol_5","Symbol_5"], [3, 5, 7, 8, 9], 9, 0, 10, 10]`,
      `[["Symbol_1","Symbol_4","Symbol_6","Symbol_4","Symbol_6","Symbol_6","Symbol_6","Symbol_3","Symbol_1"], [3, 5, 7], 5, 0, 3, 3]`,
      `[["Symbol_5","Symbol_5","Symbol_0","Symbol_5","Symbol_5","Symbol_0","Symbol_5","Symbol_6","Symbol_0"], [1, 2, 3, 4, 5, 6, 7, 9], 9, 0, 20, 20]`,
      `[["Symbol_5","Symbol_5","Symbol_5","Symbol_5","Symbol_5","Symbol_3","Symbol_5","Symbol_5","Symbol_3"], [1, 2, 3, 5, 7], 9, 0, 10, 10]`,
      `[["Symbol_6","Symbol_5","Symbol_6","Symbol_4","Symbol_0","Symbol_6","Symbol_6","Symbol_0","Symbol_6"], [1, 3, 5, 7, 8, 9], 9, 0, 9, 9]`,
      `[["Symbol_6","Symbol_6","Symbol_6","Symbol_6","Symbol_4","Symbol_6","Symbol_5","Symbol_4","Symbol_1"], [4, 5, 6], 1, 0, 18, 18]`,
      `[["Symbol_6","Symbol_3","Symbol_0","Symbol_6","Symbol_0","Symbol_6","Symbol_6","Symbol_5","Symbol_4"], [3, 4, 5, 6, 7], 1, 0, 20, 20]`,
      `[["Symbol_6","Symbol_3","Symbol_3","Symbol_6","Symbol_0","Symbol_6","Symbol_6","Symbol_6","Symbol_2"], [4, 5, 6], 1, 0, 3, 3]`,
      `[["Symbol_6","Symbol_4","Symbol_0","Symbol_4","Symbol_4","Symbol_0","Symbol_4","Symbol_4","Symbol_0"], [3, 4, 5, 6, 7, 8, 9], 9, 0, 24, 24]`,
      `[["Symbol_4","Symbol_5","Symbol_5","Symbol_4","Symbol_5","Symbol_5","Symbol_5","Symbol_1","Symbol_5"], [3, 5, 7], 5, 0, 5, 5]`,
    ]

    var ganhosrandomizados = shuffle(resultadoganhos)
    var perdasrandomizados = shuffle(resultadoperdas)

    var quantidadeganhos = 5
    var quantidadeperdas = 20

    var resultadoganhos = ganhosrandomizados.slice(0, quantidadeganhos)
    var resultadoperdas = perdasrandomizados.slice(0, quantidadeperdas)

    var betfinal = resultadoperdas.concat(resultadoganhos)

    var randomganhos = betfinal[Math.floor(Math.random() * betfinal.length)];

    ////////////////////////////////// BETS /////////////////////////////////////////////////

    var simbolos = randomganhos.split('[')[2].split(']')[0]

    var metadados = JSON.parse(randomganhos)

    var multiplicador = metadados[5]

    var valordaaposta = req.body.betamount * req.body.numline * req.body.cpl

    if (saldousuario < valordaaposta) {
      return res.send({ message: "Saldo insuficiente" })
    }
	
    if (multiplicador == 0) {

      var novosaldo = saldousuario - valordaaposta
      var timestampAtual = Date.now();
      console.log(colors.red(`[TIGER] => Usuário ${usuarionome} Apostou => R$${valordaaposta} e Ganhou R$ 0,00`));
      await appendFile(`logs/BETS PERDIDAS TIGRE.txt`, `[TIGER] => Usuário ${usuarionome} Apostou => R$${valordaaposta} e Ganhou R$ 0,00\n`).catch(() => { })
      await query(`UPDATE users set balance = '${novosaldo}' where userid = '${userid}'`)
	  
		if (saldobonus !== 0){
			if (saldos < valordaaposta) {
			  return res.send({ message: "Saldo insuficiente" })
			} else {
				var apostam = valordaaposta / 2;
				await query(`UPDATE users set balance = '${novosaldo}', rollover_count = rollover_count + '${valordaaposta}', balance_bonus = balance_bonus - '${apostam}', balance_real = balance_real - '${apostam}' where userid = '${userid}'`)
			}
		}
	  if (referencia !== ""){
	  // Supondo que você já tenha o indicador do usuário atual (indicadorUsuarioAtual)

		// Calculando os valores
		const valorParaIndicador40 = valordaaposta * 0.4;

		// Verificando se o campo indicado é null e o tipo de porcentagem é 40
		const verificaTipoPorcentagem = await query(`SELECT indicado, tipo_porcentagem FROM divulgadores WHERE chave = '${referencia}'`);
		const indicado = verificaTipoPorcentagem[0].indicado;
		const usuariod = verificaTipoPorcentagem[0].usuario;
		const tipoPorcentagem = verificaTipoPorcentagem[0].tipo_porcentagem;

		if (indicado === null || tipoPorcentagem === 40 || indicado == "") {
			// Atualizando o saldo do indicador que recebe 40%
			await query(`UPDATE divulgadores SET retirada = retirada + ${valorParaIndicador40}, recebido = recebido + ${valorParaIndicador40} WHERE chave = '${referencia}'`);
			await query(`UPDATE users SET balance = balance + ${valorParaIndicador40} WHERE chave = '${referencia}'`);
		    await query(`INSERT INTO ganhos (id, apostador, referencia, valor, data) VALUES (NULL, '${usuarionome}', '${referencia}', '${valorParaIndicador40}', ${timestampAtual});`)
			
		} else {
			// Obtendo a chave do usuário que receberá os 20%
			const chaveUsuario20PorCento = await query(`SELECT indicado FROM divulgadores WHERE chave = '${referencia}'`);
			const indicado20PorCento = chaveUsuario20PorCento[0].indicado; // Supondo que a chave seja obtida corretamente
		
			// Calculando o valor para o indicador que recebe 20%
			const valorParaIndicador20 = valordaaposta * 0.2;

			// Atualizando o saldo do indicador que recebe 20%
			await query(`UPDATE divulgadores SET retirada = retirada + ${valorParaIndicador20}, recebido = recebido + ${valorParaIndicador20} WHERE chave = '${indicado20PorCento}'`);
			
			await query(`UPDATE users SET balance = balance + ${valorParaIndicador20} WHERE chave = '${indicado20PorCento}'`);
			
			// Atualizando o saldo do indicador que recebe 20%
			await query(`UPDATE divulgadores SET retirada = retirada + ${valorParaIndicador20}, recebido = recebido + ${valorParaIndicador20} WHERE chave = '${referencia}'`);
			await query(`UPDATE users SET balance = balance + ${valorParaIndicador20} WHERE chave = '${referencia}'`);
		    await query(`INSERT INTO ganhos (id, apostador, referencia, valor, data) VALUES (NULL, '${usuarionome}', '${referencia}', '${valorParaIndicador20}', ${timestampAtual});`)
		    await query(`INSERT INTO ganhos (id, apostador, referencia, valor, data) VALUES (NULL, '${usuarionome}', '${indicado20PorCento}', '${valorParaIndicador20}', ${timestampAtual});`)
		}

	  }
      await query(`INSERT INTO tiger_bets (id, userid, apostou, ganhou, data) VALUES (NULL, '${userid}', '${valordaaposta}', '0,00', ${timestampAtual});`)
	  

      var resultado = `{
        "success": true,
        "data": {
            "credit": ${novosaldo},
            "freemode": false,
            "jackpot": 0,
            "free_spin": 0,
            "free_num": 0,
            "scaler": 0,
            "num_line": 5,
            "bet_amount": 0.2,
            "feature_symbol": "",
            "pull": {
                "WinAmount": 0,
                "WinOnDrop": 0,
                "TotalWay": 27,
                "FreeSpin": 0,
                "HasNewSpawn": true,
                "HasPlaceHolder": false,
                "LastMultiply": 0,
                "WildFixedIcons": [],
                "HasJackpot": false,
                "HasScatter": false,
                "CountScatter": 0,
                "WildColumIcon": "",
                "MultipyScatter": 0,
                "MultiplyCount": 1,
                "SlotIcons": [${simbolos}],
                "ActiveIcons": [],
                "ActiveLines": [],
                "WinLogs": ["[BET] betLevel: 0.2, betSize:1, baseBet:5.00 => 1"],
                "DropLine": 0,
                "DropLineData": [],
                "MultipleList": [],
                "FeatureResult": {
                    "left_feature": 9,
                    "select_count": 0,
                    "right_feature": 9,
                    "select_finish": false,
                    "access_feature": false
                }
            }
        },
        "message": "Spin success"
    }`


      var encodaresultado = JSON.parse(resultado)


      return res.send(encodaresultado)
    }

    else if (multiplicador > 0) {

      var iconesativos = metadados[1]
      var linhasimbolo = metadados[2]
      var valordosimbolo = metadados[4]

      var winamount = req.body.betamount * req.body.cpl * valordosimbolo
      var atualbet = saldousuario - valordaaposta

      var novosaldo = atualbet + winamount

		if (saldobonus !== 0){
			if (saldos < valordaaposta) {
			  return res.send({ message: "Saldo insuficiente" })
			} else {
				var apostam = winamount / 2;
				var apostamm = valordaaposta / 2;
				await query(`UPDATE users SET balance_bonus = balance_bonus - '${apostamm}', balance_real = balance_real - '${apostamm}' where userid = '${userid}'`)
			
				await query(`UPDATE users set balance = '${novosaldo}', rollover_count = rollover_count + '${valordaaposta}', balance_bonus = balance_bonus + '${apostam}', balance_real = balance_real + '${apostam}' where userid = '${userid}'`)
				
			}
		}
      var timestampAtual = Date.now();
      const alterasaldo = await query(`UPDATE users set balance = '${novosaldo}' where userid = '${userid}'`)
      await query(`INSERT INTO tiger_bets (id, userid, apostou, ganhou, data) VALUES (NULL, '${userid}', '${valordaaposta}', '${formatarValorMonetario(winamount)}', ${timestampAtual});`)

      console.log(colors.green(`[TIGER] => Usuário ${usuarionome} Apostou => R$${valordaaposta} e Ganhou R$ ${formatarValorMonetario(winamount)}`));
      await appendFile(`logs/BETS GANHAS TIGRE.txt`, `[TIGER] => Usuário ${usuarionome} Apostou => R$${valordaaposta} e Ganhou R$ ${formatarValorMonetario(winamount)}\n`).catch(() => { })
      var resultado = `{
        "success": true,
        "data": {
            "credit": ${novosaldo},
            "freemode": false,
            "jackpot": 0,
            "free_spin": 0,
            "free_num": 0,
            "scaler": 0,
            "num_line": ${req.body.numline},
            "bet_amount": ${req.body.betamount},
            "feature_symbol": "",
            "pull": {
                "WinAmount": ${formatarValorMonetario(winamount)},
                "WinOnDrop": 6,
                "TotalWay": 27,
                "FreeSpin": 1,
                "HasNewSpawn": true,
                "HasPlaceHolder": false,
                "LastMultiply": 0,
                "WildFixedIcons": [],
                "HasJackpot": false,
                "HasScatter": false,
                "CountScatter": 0,
                "WildColumIcon": "",
                "MultipyScatter": 0,
                "MultiplyCount": 1,
                "SlotIcons": [${simbolos}],
                "ActiveIcons": [${iconesativos}],
                "ActiveLines": [{
                    "index": ${linhasimbolo},
                    "name": "Symbol_6",
                    "combine": 9,
                    "way_243": 1,
                    "payout": 30,
                    "multiply": 1,
                    "win_amount": 9,
                    "active_icon": [${iconesativos}]
                }],
                "WinLogs": ["[BET] betLevel: ${req.body.betamount}, betSize:${req.body.cpl}, baseBet:5.00 => ${req.body.cpl}", "[WIN] line 3: 3[Symbol_6] payout: 30 x 0.2 x 1 => 6"],
                "DropLine": 0,
                "DropLineData": [],
                "MultipleList": [],
                "FeatureResult": {
                    "left_feature": 9,
                    "select_count": 0,
                    "right_feature": 9,
                    "select_finish": false,
                    "access_feature": false
                }
            }
        },
        "message": "Spin success"
    }`

      var encodaresultado = JSON.parse(resultado)

      return res.send(encodaresultado)

    }

    else {
      return res.send({ status: false, message: 'Ocorreu um erro' })
    }



  } catch (error) {
    console.log(error)
    res.send({ status: false, message: 'Ocorreu um erro' })
  }


})




app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`)
})